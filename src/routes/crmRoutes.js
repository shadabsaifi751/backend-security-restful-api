import { addNewContact, deleteContact, getContact, getContactWithId, updateContact } from "../controllers/crmController"
import { login, register, loginRequired } from "../controllers/userController"

const routes = (app) => {
    app.route("/contact")
        // get all contact
        .get((req, res, next) => {
            //middleware
            console.log(`Request from ${req.originalUrl}`)
            console.log(`Request type ${req.method}`)
            next()
        }, loginRequired, getContact)

        //post a new contact
        .post(loginRequired, addNewContact)



    app.route("/contact/:contactId")
        // get specific contact
        .get(loginRequired, getContactWithId)
        //update contact
        .put(loginRequired, updateContact)

        .delete(loginRequired, deleteContact)


    // regitration routes
    app.route("/auth/register")
        // register
        .post(register)

    app.route("/login")
        // login 
        .post(login)
}

export default routes