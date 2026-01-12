import psycopg2
import json
import uuid

# UPDATED CONFIG FOR YOUR DOCKER CONTAINER
DB_CONFIG = {
    "dbname": "postgres",
    "user": "postgres",
    "password": "DeltaHacks26", # Your Docker environment variable
    "host": "localhost",
    "port": "5432"
}

def seed_pizza_shop():
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        cur = conn.cursor()

        # 1. Create the Project (Tony's Pizza)
        # We use ON CONFLICT to avoid errors if you run this script twice
        pizza_id = '550e8400-e29b-41d4-a716-446655440000'
        cur.execute("""
            INSERT INTO projects (id, name, description, api_key)
            VALUES (%s, 'Tony Pizza Shop', 'Dine-in/Delivery analytics', 'pizza-key-123')
            ON CONFLICT (id) DO NOTHING;
        """, (pizza_id,))

        # 2. Define 10 specific events to match your hardcoded cardData
        # These will allow you to calculate Revenue, Delivery Time, Retention, and Food Cost
        events = [
            ("order_completed", {"revenue": 34.50, "cost": 6.21, "type": "dine_in"}),
            ("order_completed", {"revenue": 42.00, "cost": 7.56, "type": "delivery"}),
            ("order_completed", {"revenue": 28.00, "cost": 5.04, "type": "dine_in"}),
            ("order_completed", {"revenue": 55.00, "cost": 9.90, "type": "delivery"}),
            ("delivery_dispatched", {"time_minutes": 48}),
            ("delivery_dispatched", {"time_minutes": 52}),
            ("delivery_dispatched", {"time_minutes": 44}),
            ("user_session", {"user_id": "cust_1", "is_returning": True}),
            ("user_session", {"user_id": "cust_2", "is_returning": False}),
            ("user_session", {"user_id": "cust_1", "is_returning": True}),
        ]

        # 3. Insert Events into the analytics_events table
        for name, props in events:
            cur.execute(
                "INSERT INTO analytics_events (project_id, event_name, properties) VALUES (%s, %s, %s)",
                (pizza_id, name, json.dumps(props))
            )
        
        conn.commit()
        print("✅ Success: Scanalytics Docker DB seeded with Pizza Shop data!")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        if 'conn' in locals():
            conn.rollback()
    finally:
        if 'cur' in locals():
            cur.close()
            conn.close()

if __name__ == "__main__":
    seed_pizza_shop()