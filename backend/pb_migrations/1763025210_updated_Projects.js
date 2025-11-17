/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3853224427")

  // add field
  collection.fields.addAt(51, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_3938092973",
    "hidden": false,
    "id": "relation1343593641",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "projet",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3853224427")

  // remove field
  collection.fields.removeById("relation1343593641")

  return app.save(collection)
})
