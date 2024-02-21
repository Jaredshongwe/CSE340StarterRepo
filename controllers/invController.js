const invModel = require("../models/inventory-model")
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
            let nav = await utilities.getNav()
            res.render("./inventory/detail", {
                title: `${item.inv_year} ${item.inv_make} ${item.inv_model}`,
                detailHTML,
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

module.exports = invCont