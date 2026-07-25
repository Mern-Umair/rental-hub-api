import { db } from "../config/db.js";


export const properties = async (req, res) => {
    try {
        const { id } = req.user


        const { property_name, location, price, status } = req.body;

        const [insert] = await db.execute(
            `insert into properties (property_name,location,price,status,owner_id) values(?,?,?,?,?)`,
            [property_name, location, price, status || "available", id]
        )

        const [property] = await db.execute(
            `select id , property_name,location,price,status, created_at from properties  where id=?`,
            [insert.insertId]
        )

        res.status(201).json({
            message: "Property created successfully",
            success: true,
            propertyies: property[0]
        })

    }

    catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Internel server error",
            success: false
        })
    }
}

export const getAllProperties = async (req, res) => {
    try {

        const [properties] = await db.execute(
            `select id , property_name,location,price,status, created_at from properties`
        );

        if (properties.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No properties found",
                properties: []

            })
        }

        return res.status(200).json({
            success: true,
            message: "properties fetched successfully",
            properties
        })

    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            status: 500,
            message: "Internal server error"

        })

    }

}


export const getPropertyById = async (req, res) => {
    try {
        const { id } = req.params;
        const [properties] = await db.execute(
            `select id , property_name,location,price,status, created_at from properties where id=?`, [id]
        );
        if (properties.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Property not found",
                properties: []
            })
        }
        return res.status(200).json({
            message: "Property fetched successfully",
            success: true,
            properties: properties[0]
        })
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            message:"Internal server error",
            success:false
        })
    }
}


export const updateProperty = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id; 

        const fields = [];
        const values = [];

        if (req.body.property_name) {
            fields.push('property_name=?');
            values.push(req.body.property_name);
        }

        if (req.body.location) {
            fields.push('location=?');
            values.push(req.body.location);
        }

        if (req.body.price) {
            fields.push('price=?');
            values.push(req.body.price);
        }

        if (req.body.status) {
            fields.push('status=?');
            values.push(req.body.status);
        }

        if (fields.length === 0) {
            return res.status(400).json({
                message: "No fields to update",
                success: false
            });
        }

        values.push(id, userId);

        const [result] = await db.execute(
            `UPDATE properties 
             SET ${fields.join(',')} 
             WHERE id=? AND owner_id=?`,
            values
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Property not found or unauthorized",
                success: false
            });
        }

        const [properties] = await db.execute(
            `SELECT * FROM properties WHERE id=?`,
            [id]
        );

        res.status(200).json({
            success: true,
            message: "Property updated successfully",
            property: properties[0]
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }

};


export const deleteProperty = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        // 1. Property exist karti hai ya nahi
        const [existingProperty] = await db.execute(
            `SELECT * FROM properties WHERE id=?`, [id]
        );

        if (existingProperty.length === 0) {
            return res.status(404).json({
                message: "Property not found",
                success: false
            });
        }

        // 2. Ye property is user ki hai ya nahi
        if (existingProperty[0].owner_id !== userId) {
            return res.status(403).json({
                message: "Unauthorized - You can only delete your own property",
                success: false
            });
        }

        // 3. Delete karo
        await db.execute(
            `DELETE FROM properties WHERE id=? AND owner_id=?`,
            [id, userId]
        );

        return res.status(200).json({
            success: true,
            message: "Property deleted successfully"
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};