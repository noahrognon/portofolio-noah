/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3853224427")

  // remove field
  collection.fields.removeById("text3274028405")

  // remove field
  collection.fields.removeById("text423058255")

  // add field
  collection.fields.addAt(49, new Field({
    "hidden": false,
    "id": "json3274028405",
    "maxSize": 0,
    "name": "result_points",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "json"
  }))

  // add field
  collection.fields.addAt(50, new Field({
    "hidden": false,
    "id": "json423058255",
    "maxSize": 0,
    "name": "stack_features",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "json"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3853224427")

  // add field
  collection.fields.addAt(29, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text3274028405",
    "max": 0,
    "min": 0,
    "name": "result_points",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(35, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text423058255",
    "max": 0,
    "min": 0,
    "name": "stack_features",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // remove field
  collection.fields.removeById("json3274028405")

  // remove field
  collection.fields.removeById("json423058255")

  return app.save(collection)
})
