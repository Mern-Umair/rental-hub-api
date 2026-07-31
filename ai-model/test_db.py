import mysql.connector

try:
    conn = mysql.connector.connect(
        host='127.0.0.1',
        user='root',
        password='umair',
        port=3306,
        charset='utf8',
        use_unicode=True
    )
    cursor = conn.cursor()
    cursor.execute("SHOW DATABASES")
    databases = cursor.fetchall()
    print("Available databases:")
    for db in databases:
        print(db)
    cursor.close()
    conn.close()
except Exception as e:
    print(f"Error: {e}")