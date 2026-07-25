

export const createPropertyTable = async (db) => {
    await db.execute(
        `
     create table if not exists properties(
        id int auto_Increment primary key,
        property_name varchar(100) not null,
        location varchar(100) not null,
        price DECIMAL(10,2) NOT NULL,
        owner_id INT NOT NULL,
        FOREIGN KEY (owner_id) REFERENCES users(id),
        status varchar(255) not null
     )
    `
    )
}