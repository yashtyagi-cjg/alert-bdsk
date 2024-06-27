const asyncHandler = require('express-async-handler');
const {body, validationResult} = require('express-validator');
const Client = require('./../models/client');


/**
 * This should be used for admin panel.
 */



/**
 * Create a new client.
 * 
 * @async
 * @function createClient
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.createClient = asyncHandler(
    async(req, res, next)=>{
        const client = new Client({
            name: req.body.name,
            messageLimit: req.body.messageLimit,
            currentCounter: req.body.currentCounter,
            phoneNumber: req.body.phoneNumber,
        })

        await client.save().catch((err)=>{
            console.log(`ERROR while createing client: ${client}`);
            console.log(`ERROR: ${err}`);
            return res.status(500).json({message: "Error encountered while creating Client"});
        })

        res.status(200).json({message: "Client Created Successfully"});
        console.log(`SUCCESS: CREATE CLIENT `);
    }
)


/**
 * Delete a client by ID.
 * 
 * @async
 * @function deleteClient
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.deleteClient = asyncHandler(
    async(req, res, next)=>{
        await Client.findByIdAndDelete(req.params.id).exec().catch((err)=>{
            console.log(`${req.params.id}: Error encountered while deleting client`);
            console.log(`ERROR: ${err}`);
            return res.status(500).json({message: "Error encountered while deleing clieng"});
        })

        res.status(200).json({message: "Client deleted successfully"});
        console.log(`SUCCESS: DELETE A CLIENT ${req.params.id}`);
    }
)



/**
 * Update a client by ID.
 * 
 * @async
 * @function updateClient
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.updateClient = asyncHandler(
    async(req, res, next)=>{
        const client = {
            name: req.body.name,
            messageLimit: req.body.messageLimit,
            currentCounter: req.body.currentCounter,
            phoneNumber: req.body.phoneNumber,
        }

        await Client.findByIdAndUpdate(req.params.id, client).exec().catch((err)=>{
            console.log(`${req.params.id}: Encountered error while updating`);
            console.log(`UPDATED OBJ: ${client}`);
            console.log(`ERROR: ${err}`);
            return res.status(500).json({message: "Error encountered while updating Client"});
        })

        res.status(200).json({message: `${req.params.id} Updated successfully`});
        console.log(`SUCCESS: UPDATE A CLIENT ${req.params.id}`);
    }
)



/**
 * Get all clients.
 * 
 * @async
 * @function getAllClients
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.getAllClients = asyncHandler(
    async(req, res, next)=>{
        const allClients = await Client.find({}).exec().catch((err)=>{
            console.log('ERROR While fetching all the clients');
            console.log(`ERROR: ${err}`)
            return res.status(500).json({message: "Error encountered while fetching clients"})
        })

        if(!allClients){
            return res.status(404).json({message: "No clients available"});
        }

        const formattedClients = allClients.map((client)=>{
            return {
                _id: client._id,
                name: req.body.name,
                messageLimit: req.body.messageLimit,
                currentCounter: req.body.currentCounter,
                phoneNumber: req.body.phoneNumber,
            }
        })

        res.status(200).json(formattedClients);
        console.log(`SUCCESS: GET ALL CLIENT`);
    }
)



/**
 * Get a client by ID.
 * 
 * @async
 * @function getAClient
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.getAClient = asyncHandler(
    async(req, res, next)=>{
        const client = await Client.findById(req.params.id).exec().catch((err)=>{
            console.log(`${req.params.id}: Error encountered while fetching client`);
            console.log(`ERROR: ${err}`);
            return res.status(500).json({message: "Error encountered while fetching client"});

        })

        if(!client){
            console.log(`${req.params.id}: No client found`);
            return res.status(404).json({message: "Client not found"});
        }

        res.status(200).json(client);
        console.log(`SUCCESS: GET A CLIENT ${req.params.id}`);
    }
)



/**
 * Increment the counter for a client by ID.
 * 
 * @async
 * @function incrementCounter
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.incrementCounter = asyncHandler(
    async(req, res, next)=>{

        await Client.findByIdAndUpdate(req.params.id, {currentCounter: currentCounter + 1}).exec().catch((err)=>{
            console.log(`${req.params.id}: Error encountered while incrementing counter`);
            console.log(`ERROR: ${err}`);
            return res.status(500).json({message: "Encountered error while incrementing"});
        })

        res.status(200).json({message: "Counter incremented successfully"});
        console.log(`${req.params.id}: Counter incremented successfully`);
    }
)