const express = require('express');
const router = express.Router();
const db = require('../db'); // Import the database connection pool

/**
 * @swagger
 * tags:
 *   name: Countries
 *   description: API endpoints for managing countries
 * 
 * components:
 *   schemas:
 *     Country:
 *       type: object
 *       properties:
 *         country_id:
 *           type: integer
 *         country_name:
 *           type: string
 *         region_id:
 *           type: integer
 *       required:
 *         - country_name
 *         - region_id
 * 
 * /countries:
 *   get:
 *     summary: Retrieve all countries
 *     description: Retrieve a list of all countries from the database.
 *     responses:
 *       '200':
 *         description: A JSON array of countries.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Country'
 *
 *   post:
 *     summary: Add a new country
 *     description: Add a new country to the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Country'
 *     responses:
 *       '201':
 *         description: Successfully created a new country.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Country'
 *
 * /countries/{id}:
 *   get:
 *     summary: Retrieve a specific country by ID
 *     description: Retrieve details of a specific country based on its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the country to retrieve.
 *     responses:
 *       '200':
 *         description: Details of the country.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Country'
 *
 *   put:
 *     summary: Update an existing country
 *     description: Update details of an existing country based on its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the country to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Country'
 *     responses:
 *       '200':
 *         description: Updated details of the country.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Country'
 *
 *   delete:
 *     summary: Delete a country
 *     description: Delete a country from the database based on its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the country to delete.
 *     responses:
 *       '200':
 *         description: Country deleted successfully.
 */

// GET all countries



// GET a specific country by ID
router.get('/:id', async (req, res, next) => {
    const countryId = req.params.id;
    try {
        const { rows } = await db.query('SELECT * FROM country WHERE country_id = $1', [countryId]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Country not found' });
        }
        res.json(rows[0]); // Send the retrieved country as JSON response
    } catch (error) {
        next(error); // Pass any errors to the error handling middleware
    }
});

// POST add a new country
router.post('/', async (req, res, next) => {
    const { country_name, region_id } = req.body;
    try {
        const { rows } = await db.query(
            'INSERT INTO country (country_name, region_id) VALUES ($1, $2) RETURNING *',
            [country_name, region_id]
        );
        res.status(201).json(rows[0]); // Send the newly added country as JSON response with status 201 (Created)
    } catch (error) {
        next(error); // Pass any errors to the error handling middleware
    }
});

// PUT update an existing country
router.put('/:id', async (req, res, next) => {
    const countryId = req.params.id;
    const { country_name, region_id } = req.body;
    try {
        const { rows } = await db.query(
            'UPDATE country SET country_name = $1, region_id = $2 WHERE country_id = $3 RETURNING *',
            [country_name, region_id, countryId]
        );
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Country not found' });
        }
        res.json(rows[0]); // Send the updated country as JSON response
    } catch (error) {
        next(error); // Pass any errors to the error handling middleware
    }
});

// DELETE a country
router.delete('/:id', async (req, res, next) => {
    const countryId = req.params.id;
    try {
        const { rows } = await db.query('DELETE FROM country WHERE country_id = $1 RETURNING *', [countryId]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Country not found' });
        }
        res.json({ message: 'Country deleted successfully' });
    } catch (error) {
        next(error); // Pass any errors to the error handling middleware
    }
});

module.exports = router; // Export the router object to be used by the main application
