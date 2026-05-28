# Dev utility: imports recipes from production into local D
import json, sqlite3, urllib.request, os

BASE_URL = "https://my-kondatte-app-production.up.railway.app"

recipes = json.loads(urllib.request.urlopen(f"{BASE_URL}/api/recipe").read())

db = sqlite3.connect("MyApi/kondatte.db")
cursor = db.cursor()

for r in recipes:
    cursor.execute(
        "INSERT OR IGNORE INTO Recipes (Id, Name, Ingredients, Instructions, ImagePath) VALUES (?, ?, ?, ?, ?)",
        (r["id"], r["name"], r["ingredients"], r["instructions"], r.get("imagePath")),
    )
    if r.get("imagePath"):
        dest = f"MyApi/wwwroot/images/{r['imagePath']}"
        if not os.path.exists(dest):
            urllib.request.urlretrieve(f"{BASE_URL}/images/{r['imagePath']}", dest)
            print(f"Downloaded image: {r['imagePath']}")

db.commit()
print(f"Imported {len(recipes)} recipes")
db.close()
