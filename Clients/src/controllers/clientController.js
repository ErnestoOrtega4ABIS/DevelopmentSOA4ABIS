import Client from '../models/clientModel.js';
import { clientCreatedEvent } from '../services/rabbitServicesEvent.js';

export const getClients = async (req, res) => { 
    try {
        const clients = await Client.findAll({
            where: { status: true } // Filtrar solo clientes con status = true
        });
        return res.status(200).json(clients);
    } catch (error) {
        console.error('Error al listar clientes: ', error);
        return res.status(500).json({ message: 'Error al obtener los clientes' });
    }
};


export const createClient = async(req, res) => {
    try {
        const { name, lastname, secondLastname, email, phone, birthdate, address,  } = req.body;

        // Validar campos obligatorios
        if (!name || !lastname || !secondLastname || !email || !phone || !birthdate || !address) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }

        //Validar formato de correo
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Formato de correo inválido' });
        }

        //Validar longitud exacta del teléfono
        if (phone.length !== 10) {
            return res.status(400).json({ message: 'El teléfono debe tener exactamente 10 dígitos' });
        }

        const existingPhone = await Client.findOne({ where: { phone } });
        if (existingPhone) {
            return res.status(400).json({ message: 'El teléfono ya está registrado' });
        }

        const existingEmail = await Client.findOne({ where: { email } });
        if (existingEmail) {
            return res.status(400).json({ message: 'El correo ya está registrado' });
        }

        //Crear nuevo cliente
        const newClient = await Client.create({
            name,
            lastname,
            secondLastname,
            email,
            phone,
            birthdate,
            address,
            status: true,
        });

        console.log(newClient);
        await clientCreatedEvent(newClient);
        return res.status(201).json({ message: 'Cliente Creado', data: newClient });
    } catch (error) {
        console.error('Error al crear cliente: ', error);
        return res.status(500).json({ message: 'Error al crear el cliente' });
    }
};

export const updateClient = async(req, res) => {
    const { id } = req.params;
    const { name, lastname, secondLastname, email, phone, birthdate, address } = req.body;

    try {
        const client = await Client.findByPk(id);

        if (!client) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }

        // Validar campos obligatorios
        if (!name || !lastname || !secondLastname || !email || !phone || !birthdate || !address) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }

        // Validar formato de correo
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Formato de correo inválido' });
        }

        // Validar longitud exacta del teléfono
        if (phone.length !== 10) {
            return res.status(400).json({ message: 'El teléfono debe tener exactamente 10 dígitos' });
        }

        const existingPhone = await Client.findOne({ where: { phone } });
        if (existingPhone && existingPhone.id !== id) {
            return res.status(400).json({ message: 'El teléfono ya está registrado' });
        }

        await client.update({
            name,
            lastname,
            secondLastname,
            email,
            phone,
            birthdate,
            address,
        });

        return res.status(200).json({ message: 'Cliente actualizado', data: client });

    } catch (error) {
        console.error('Error al actualizar cliente: ', error);
        return res.status(500).json({ message: 'Error al actualizar el cliente' });
    }
};

export const deleteClient = async(req, res) => {
    const { id } = req.params;

    try{
        //Verificar si el cliente existe
        const client = await Client.findByPk(id);
        if (!client) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }
        
        //Verificar si el cliente ya está desactivado
        if (!client.status) {
            return res.status(400).json({ message: 'El cliente ya está desactivado' });
        }

        //Desactivar cliente
        await client.update({ status: false });
        return res.status(200).json({ message: 'Cliente desactivado' });

    } catch (error) {
        console.error('Error al desactivar cliente: ', error);
        return res.status(500).json({ message: 'Error al desactivar el cliente' });
    }
};