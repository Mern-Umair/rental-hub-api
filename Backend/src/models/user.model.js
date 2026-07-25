

export const createUsersTable = async (db) => {
    await db.execute(`
    create table if not exists user(
    id INT auto_Increment primary key,
    name varchar(100) not null,
    email varchar(100) not null,
    password varchar(255) not null,
    role enum('owner','tenant','admin')default 'tenant',
    phone varchar(20) not null,
    created_at TimeStamp default current_TimeStamp
    )
   ` )
}
