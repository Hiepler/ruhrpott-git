#!/usr/bin/env node

const { spawn } = require('child_process');
const commands = require('./commands');

const command = process.argv[2];
const args = process.argv.slice(3);

if (!command) {
    console.log("Eyy, du Pfeife! Gib mal nen Befehl ein!");
    console.log("Versuch's mal mit: ruhrpott kneipe");
    process.exit(1);
}

if (!commands[command]) {
    console.log(`Wat willste denn? '${command}' kenn ich nich!`);
    console.log("Vielleicht haste dich vertippt, oder der Befehl is noch nich erfunden.");
    process.exit(1);
}

const { gitCommand, message } = commands[command];

try {
    const child = spawn('git', [gitCommand, ...args]);

    child.stdout.on('data', (data) => {
        console.log(message);
        console.log(data.toString());
    });

    child.stderr.on('data', (data) => {
        console.error(`Ey, da is wat schief gelaufen: ${data.toString()}`);
    });

    child.on('close', (code) => {
        if (code !== 0) {
            console.error(`Der Prozess is mit Code ${code} beendet. Mach mal Klarschiff und versuch's nochmal!`);
        }
    });
} catch (error) {
    console.error(`Ey, da is wat schief gelaufen: ${error.message}`);
    process.exit(1);
}
