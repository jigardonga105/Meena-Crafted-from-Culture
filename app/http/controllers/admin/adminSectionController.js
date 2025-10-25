const User = require("../../../models/user");

function adminSectionController() {
    return {
        async adminSection(req, res) {
            let courierCom = await User.find({ role: 'courier' });
            let msg = req.params.msg;

            return res.render('admin/adminSection', { courierCom, msg });
        }
    }
}

module.exports = adminSectionController