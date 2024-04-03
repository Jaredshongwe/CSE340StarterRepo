const invModel = require("../models/inventory-model")
const managementModel = require("../models/management-model");
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render("./inventory/classification", {
        title: className + " vehicles",
        nav,
        grid,
    })
}

/* ********************************
 *  Build specific inventory item view
 * ******************************** */
invCont.buildInventoryItemDetail = async function (req, res, next) {
    const invId = req.params.invId; // Assuming the URL parameter is named invId
    try {
        const item = await invModel.getInventoryItemById(invId);
        if (item) {
            const detailHTML = utilities.buildVehicleDetail(item);
            const total = new Intl.NumberFormat('en-US').format(item.inv_price)
            let nav = await utilities.getNav()
            res.render("./inventory/detail", {
                title: `${item.inv_year} ${item.inv_make} ${item.inv_model}`,
                detailHTML,
                total,
                price: item.inv_price,
                nav,
            });
        } else {
            // Handle the case where no item is found for the given ID
            res.status(404).send("Item not found");
        }
    } catch (error) {
        console.error("Error in buildInventoryItemDetail: ", error);
        res.status(500).send("Internal Server Error");
    }
};

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
    const classification_id = parseInt(req.params.classification_id)
    const invData = await invModel.getInventoryByClassificationId(classification_id)
    if (invData[0].inv_id) {
        return res.json(invData)
    } else {
        next(new Error("No data returned"))
    }
}


/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
    const inv_id = parseInt(req.params.invId)
    let nav = await utilities.getNav()
    const itemData = await invModel.getInventoryItemById(inv_id)
    const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
    const itemName = `${itemData.inv_make} ${itemData.inv_model}`
    res.render("./inventory/edit-inventory", {
        title: "Edit " + itemName,
        nav,
        classificationSelect: classificationSelect,
        errors: null,
        inv_id: inv_id,
        inv_make: itemData.inv_make,
        inv_model: itemData.inv_model,
        inv_year: itemData.inv_year,
        inv_description: itemData.inv_description,
        inv_image: itemData.inv_image,
        inv_thumbnail: itemData.inv_thumbnail,
        inv_price: itemData.inv_price,
        inv_miles: itemData.inv_miles,
        inv_color: itemData.inv_color,
        classification_id: itemData.classification_id
    })
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
    let nav = await utilities.getNav()
    const {
        inv_id,
        inv_make,
        inv_model,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_year,
        inv_miles,
        inv_color,
        classification_id,
    } = req.body
    const updateResult = await managementModel.updateInventory(
        inv_id,
        inv_make,
        inv_model,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_year,
        inv_miles,
        inv_color,
        classification_id
    )

    if (updateResult) {
        const itemName = updateResult.inv_make + " " + updateResult.inv_model
        req.flash("notice", `The ${itemName} was successfully updated.`)
        res.redirect("/inv/")
    } else {
        const classificationSelect = await utilities.buildClassificationList(classification_id)
        const itemName = `${inv_make} ${inv_model}`
        req.flash("notice", "Sorry, the insert failed.")
        res.status(501).render("inventory/edit-inventory", {
            title: "Edit " + itemName,
            nav,
            classificationSelect: classificationSelect,
            errors: null,
            inv_id,
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color,
            classification_id
        })
    }
}

/* ***************************
 *  Build delete inventory view
 * ************************** */
invCont.deleteView = async function (req, res, next) {
    const inv_id = parseInt(req.params.invId)
    let nav = await utilities.getNav()
    const itemData = await invModel.getInventoryItemById(inv_id)
    const itemName = `${itemData.inv_make} ${itemData.inv_model}`
    res.render("./inventory/delete-confirm", {
        title: "Delete " + itemName,
        nav,
        errors: null,
        inv_id: inv_id,
        inv_make: itemData.inv_make,
        inv_model: itemData.inv_model,
        inv_year: itemData.inv_year,
        inv_price: itemData.inv_price,
    })
}

/* ***************************
 *  Build inventory Item
 * ************************** */
invCont.deleteItem = async function (req, res, next) {
    const inv_id = parseInt(req.body.inv_id)
    const deleteResult = await managementModel.deleteInventoryItem(inv_id)

    if (deleteResult) {
        req.flash("notice", 'The deletion was successful.')
        res.redirect('/inv/')
    } else {
        req.flash("notice", 'Sorry, the delete failed.')
        res.redirect('/inv/delete/inv_id')
    }
}

module.exports = invCont