const express = require('express');
const router = express.Router();
const db = require('../db'); // Import the database connection pool

/**
 * @swagger
 * tags:
 *   name: SalesChannels
 *   description: API endpoints for managing sales channels
 * 
 * components:
 *   schemas:
 *     SalesChannel:
 *       type: object
 *       properties:
 *         channel_id:
 *           type: integer
 *         channel_name:
 *           type: string
 *       required:
 *         - channel_name
 * 
 * /sales-channels:
 *   get:
 *     summary: Retrieve all sales channels
 *     description: Retrieve a list of all sales channels from the database.
 *     responses:
 *       '200':
 *         description: A JSON array of sales channels.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SalesChannel'
 *
 *   post:
 *     summary: Add a new sales channel
 *     description: Add a new sales channel to the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SalesChannel'
 *     responses:
 *       '201':
 *         description: Successfully created a new sales channel.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SalesChannel'
 *
 * /sales-channels/{id}:
 *   get:
 *     summary: Retrieve a specific sales channel by ID
 *     description: Retrieve details of a specific sales channel based on its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the sales channel to retrieve.
 *     responses:
 *       '200':
 *         description: Details of the sales channel.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SalesChannel'
 *
 *   put:
 *     summary: Update an existing sales channel
 *     description: Update details of an existing sales channel based on its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the sales channel to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SalesChannel'
 *     responses:
 *       '200':
 *         description: Updated details of the sales channel.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SalesChannel'
 *
 *   delete:
 *     summary: Delete a sales channel
 *     description: Delete a sales channel from the database based on its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the sales channel to delete.
 *     responses:
 *       '200':
 *         description: Sales channel deleted successfully.
 */

// GET all sales channels
router.get('/', async (req, res, next) => {
    try {
        const { rows } = await db.query('SELECT * FROM sales_channel ORDER BY channel_id');
        res.json(rows); // Send the retrieved sales channels as JSON response
    } catch (error) {
        next(error); // Pass any errors to the error handling middleware
    }
});

// GET a specific sales channel by ID
router.get('/:id', async (req, res, next) => {
    const channelId = req.params.id;
    try {
        const { rows } = await db.query('SELECT * FROM sales_channel WHERE channel_id = $1', [channelId]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Sales channel not found' });
        }
        res.json(rows[0]); // Send the retrieved sales channel as JSON response
    } catch (error) {
        next(error); // Pass any errors to the error handling middleware
    }
});

// POST add a new sales channel
router.post('/', async (req, res, next) => {
    const { channel_name } = req.body;
    try {
        const { rows } = await db.query(
            'INSERT INTO sales_channel (channel_name) VALUES ($1) RETURNING *',
            [channel_name]
        );
        res.status(201).json(rows[0]); // Send the newly added sales channel as JSON response with status 201 (Created)
    } catch (error) {
        next(error); // Pass any errors to the error handling middleware
    }
});

// PUT update an existing sales channel
router.put('/:id', async (req, res, next) => {
    const channelId = req.params.id;
    const { channel_name } = req.body;
    try {
        const { rows } = await db.query(
            'UPDATE sales_channel SET channel_name = $1 WHERE channel_id = $2 RETURNING *',
            [channel_name, channelId]
        );
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Sales channel not found' });
        }
        res.json(rows[0]); // Send the updated sales channel as JSON response
    } catch (error) {
        next(error); // Pass any errors to the error handling middleware
    }
});

// DELETE a sales channel
router.delete('/:id', async (req, res, next) => {
    const channelId = req.params.id;
    try {
        const { rows } = await db.query('DELETE FROM sales_channel WHERE channel_id = $1 RETURNING *', [channelId]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Sales channel not found' });
        }
        res.json({ message: 'Sales channel deleted successfully' });
    } catch (error) {
        next(error); // Pass any errors to the error handling middleware
    }
});

module.exports = router; // Export the router object to be used by the main application
