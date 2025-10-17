/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_865317514")

  // add field
  collection.fields.addAt(2, new Field({
    "hidden": false,
    "id": "select1454688268",
    "maxSelect": 1,
    "name": "Theme",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "Design",
      "Comm",
      "Audiovisuel",
      "Gestion"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_865317514")

  // remove field
  collection.fields.removeById("select1454688268")

  return app.save(collection)
})
