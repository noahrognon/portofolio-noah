/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3853224427")

  // add field
  collection.fields.addAt(50, new Field({
    "hidden": false,
    "id": "json2060577490",
    "maxSize": 0,
    "name": "context_extra_blocks",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "json"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3853224427")

  // remove field
  collection.fields.removeById("json2060577490")

  return app.save(collection)
})
