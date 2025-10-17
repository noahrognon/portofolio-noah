/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2029269628")

  // remove field
  collection.fields.removeById("text1272968043")

  // add field
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "select2024737484",
    "maxSelect": 1,
    "name": "domaine",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "Frontend",
      "Backend",
      "outil",
      "Performance"
    ]
  }))

  // add field
  collection.fields.addAt(4, new Field({
    "hidden": false,
    "id": "select1272968043",
    "maxSelect": 1,
    "name": "niveau",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "Avancé",
      "Débutant"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2029269628")

  // add field
  collection.fields.addAt(3, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text1272968043",
    "max": 0,
    "min": 0,
    "name": "niveau",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // remove field
  collection.fields.removeById("select2024737484")

  // remove field
  collection.fields.removeById("select1272968043")

  return app.save(collection)
})
