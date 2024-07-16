const express = require('express');
const router = express.Router();
const db = require('../db'); // Import the database connection pool

/**
 * @swagger
 * tags:
 *   name: ItemTypes
 *   description: API endpoints for managing item types
 * 
 * components:
 *   schemas:
 *     ItemType:
 *       type: object
 *       properties:
 *         item_type_id:
 *           type: integer
 *         item_type_name:
 *           type: string
 *       required:
 *         - item_type_name
 * 
 * /item-types:
 *   get:
 *     summary: Retrieve all item types
 *     description: Retrieve a list of all item types from the database.
 *     responses:
 *       '200':
 *         description: A JSON array of item types.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ItemType'
 *
 *   post:
 *     summary: Add a new item type
 *     description: Add a new item type to the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ItemType'
 *     responses:
 *       '201':
 *         description: Successfully created a new item type.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ItemType'
 *
 * /item-types/{id}:
 *   get:
 *     summary: Retrieve a specific item type by ID
 *     description: Retrieve details of a specific item type based on its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the item type to retrieve.
 *     responses:
 *       '200':
 *         description: Details of the item type.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ItemType'
 *
 *   put:
 *     summary: Update an existing item type
 *     description: Update details of an existing item type based on its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the item type to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ItemType'
 *     responses:
 *       '200':
 *         description: Updated details of the item type.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ItemType'
 *
 *   delete:
 *     summary: Delete an item type
 *     description: Delete an item type from the database based on its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the item type to delete.
 *     responses:
 *       '200':
 *         description: Item type deleted successfully.
 */

// GET all item types
router.get('/', async (req, res, next) => {
    try {
        const { rows } = await db.query('SELECT * FROM item_type ORDER BY item_type_id');
        res.json(rows); // Send the retrieved item types as JSON response
    } catch (error) {
        next(error); // Pass any errors to the error handling middleware
    }
});

// GET a specific item type by ID
router.get('/:id', async (req, res, next) => {
    const itemTypeId = req.params.id;
    try {
        const { rows } = await db.query('SELECT * FROM item_type WHERE item_type_id = $1', [itemTypeId]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Item type not found' });
        }
        res.json(rows[0]); // Send the retrieved item type as JSON response
    } catch (error) {
        next(error); // Pass any errors to the error handling middleware
    }
});

// POST add a new item type
router.post('/', async (req, res, next) => {
    const { item_type_name } = req.body;
    try {
        const { rows } = await db.query(
            'INSERT INTO item_type (item_type_name) VALUES ($1) RETURNING *',
            [item_type_name]
        );
        res.status(201).json(rows[0]); // Send the newly added item type as JSON response with status 201 (Created)
    } catch (error) {
        next(error); // Pass any errors to the error handling middleware
    }
});

// PUT update an existing item type
router.put('/:id', async (req, res, next) => {
    const itemTypeId = req.params.id;
    const { item_type_name } = req.body;
    try {
        const { rows } = await db.query(
            'UPDATE item_type SET item_type_name = $1 WHERE item_type_id = $2 RETURNING *',
            [item_type_name, itemTypeId]
        );
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Item type not found' });
        }
        res.json(rows[0]); // Send the updated item type as JSON response
    } catch (error) {
        next(error); // Pass any errors to the error handling middleware
    }
});

// DELETE an item type
router.delete('/:id', async (req, res, next) => {
    const itemTypeId = req.params.id;
    try {
        const { rows } = await db.query('DELETE FROM item_type WHERE item_type_id = $1 RETURNING *', [itemTypeId]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Item type not found' });
        }
        res.json({ message: 'Item type deleted successfully' });
    } catch (error) {
        next(error); // Pass any errors to the error handling middleware
    }
});

module.exports = router; // Export the router object to be used by the main application
