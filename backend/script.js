const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/userModel');
const Request = require('./models/requestModel');
const Server = require('./models/serverModel');

// Helper function to create a random string
const createRandomString = (length) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

async function createUsers() {
    const users = [];
    const adminRoles = ['GeneralSpecAdmin', 'NetworkAdmin', 'SuperAdmin'];
    const ordinaryPositions = ['Developer', 'Tester', 'Manager', 'DevOps', 'Support'];

    // Create 20 admins
    for (let i = 0; i < 20; i++) {
        const hashedPassword = await bcrypt.hash('password123', 10);
        users.push({
            fullName: `Admin User ${i + 1}`,
            email: `admin${i + 1}@gmail.com`,
            password: hashedPassword,
            position: 'Manager',
            matricule: `ADMIN_MATRICULE${i + 1}`,
            phoneNumber: `123454489${String(i).padStart(2, '0')}`,
            role: adminRoles[i % adminRoles.length],
        });
    }

    // Create 60 ordinary users (with an empty role)
    for (let i = 0; i < 260; i++) {
        const hashedPassword = await bcrypt.hash('password123', 10);
        users.push({
            fullName: `User ${i + 1}`,
            email: `user${i + 1}@gmail.com`,
            password: hashedPassword,
            position: ordinaryPositions[i % ordinaryPositions.length],
            matricule: `USER_MATRICfLE${i + 1111}`,
            phoneNumber: `9875554321${String(i).padStart(2, '0')}`,
            role: 'OrdinaryUser', 
        });
    }

    await User.insertMany(users);
}

async function createRequests() {
    const requests = [];
    const environments = ['testing', 'staging', 'developing', 'production'];
    const operatingSystems = ['RHEL 8.4', 'Ubuntu 20.04 LTS', 'Windows Server 2022', 'CentOS 8', 'Debian 11', 'SUSE Linux Enterprise Server 15', 'Oracle Linux 8'];
    const admins = await User.find({ role: 'GeneralSpecAdmin' });

    for (let i = 0; i < 100; i++) {
        const randomAdmin = admins[Math.floor(Math.random() * admins.length)];
        requests.push({
            responderId: randomAdmin._id,
            requesterId: `REQ_USER_ID${i + 1}`,
            fullName: `Requester ${i + 1}`,
            position: 'Developer',
            matricule: `REQ_MATRICULE${i + 1}`,
            environment_type: environments[i % environments.length],
            vmName: `VM_NAME_${i + 1}`,
            description: `VM Description ${i + 1}`,
            desired_start_date: new Date(),
            operating_system: operatingSystems[i % operatingSystems.length],
            disk_space: `${10 + (i % 90)}GB`,
            ram: `${2 + (i % 14)}GB`,
            vcpu: `${1 + (i % 7)} cores`,
        });
    }

    await Request.insertMany(requests);
}

async function createServers() {
    const servers = [];
    const networkAdmins = await User.find({ role: 'NetworkAdmin' });
    const requests = await Request.find({});

    const totalServers = 100;
    const half = totalServers / 2;

    for (let i = 0; i < totalServers; i++) {
        const randomNetworkAdmin = networkAdmins[Math.floor(Math.random() * networkAdmins.length)];
        const randomRequest = requests[Math.floor(Math.random() * requests.length)];
        servers.push({
            adminId: randomNetworkAdmin._id,
            adminName: randomNetworkAdmin.fullName,
            vmName: `Server_VM_${i + 1}`,
            username: `admin${i + 1}`,
            requestId: randomRequest._id,
            requesterId: randomRequest.requesterId,
            requesterName: randomRequest.fullName,
            requesterMatricule: randomRequest.matricule,
            password: createRandomString(10),
            environment_type: randomRequest.environment_type,
            operating_system: randomRequest.operating_system,
            ram: randomRequest.ram,
            cpu: randomRequest.vcpu,
            disk_space: randomRequest.disk_space,
            privateIP: `192.168.${Math.floor(i / 254)}.${i % 254 + 1}`,
            subnetMask: '255.255.255.0',
            defaultGateway: '192.168.0.1',
            // Alternate between true and false for wantToDelete
            wantToDelete: i < half
        });
    }

    await Server.insertMany(servers);
}

async function populateDatabase() {
    try {
        await mongoose.connect('mongodb://localhost:27017/server-provisioning-app', { useNewUrlParser: true, useUnifiedTopology: true });
        await createUsers();
        await createRequests();
        await createServers();
        console.log('Database populated successfully.');
    } catch (error) {
        console.error('Error populating database:', error);
    } finally {
        await mongoose.disconnect();
    }
}

populateDatabase();
