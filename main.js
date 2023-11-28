const fs = require('fs');
const readline = require('readline');

const filename = 'user_data.txt';

if (!fs.existsSync(filename)) {
    fs.writeFileSync(filename, ''); 
    console.log(`Файл ${filename} був створений.`);
}

function writeUserData(name, age) {
    const data = `${name},${age}\n`;

    fs.appendFile(filename, data, (err) => {
        if (err) throw err;
        console.log('Дані успішно записано в файл.');
    });
}

function readUserData() {
    fs.readFile(filename, 'utf8', (err, data) => {
        if (err) throw err;

        if (data.trim() === '') {
            console.log('Файл користувача порожній.');
        } else {
            console.log('Дані користувача в файлі:');
            console.log(data);
            askUserAction();
        }
    });
}

function deleteUserData() {
    fs.unlink(filename, (err) => {
        if (err) throw err;
        console.log('Дані користувача успішно видалено з файлу.');
    });
}

function updateUserData(nameToUpdate, newAge) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question(`Введіть новий вік для користувача ${nameToUpdate}: `, (answer) => {
        rl.close();

        fs.readFile(filename, 'utf8', (err, data) => {
            if (err) throw err;

            const lines = data.split('\n');
            for (let i = 0; i < lines.length; i++) {
                const [name, age] = lines[i].split(',');
                if (name === nameToUpdate) {
                    lines[i] = `${name},${answer}`;
                    break;
                }
            }

            const updatedData = lines.join('\n');
            fs.writeFile(filename, updatedData, (err) => {
                if (err) throw err;
                console.log(`Вік користувача ${nameToUpdate} оновлено в файлі.`);
            });
        });
    });
}

function askUserAction() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question('Хочете змінити чи видалити дані користувача? (y/n): ', (answer) => {
        rl.close();

        if (answer.toLowerCase() === 'y') {
            updateOrDeleteUserData();
        } else {
            console.log('Дякую за використання програми!');
        }
    });
}

function updateOrDeleteUserData() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question('Введіть ім\'я користувача, якого хочете змінити або видалити: ', (name) => {
        rl.close();

        fs.readFile(filename, 'utf8', (err, data) => {
            if (err) throw err;

            const lines = data.split('\n');
            let userExists = false;

            for (let i = 0; i < lines.length; i++) {
                const [existingName, age] = lines[i].split(',');
                if (existingName === name) {
                    userExists = true;
                    break;
                }
            }

            if (userExists) {
                askUpdateOrDelete(name);
            } else {
                console.log(`Користувача з іменем ${name} не знайдено.`);
                askUserAction();
            }
        });
    });
}

function askUpdateOrDelete(name) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question(`Виберіть опцію для користувача ${name}: (u - змінити, d - видалити): `, (answer) => {
        rl.close();

        if (answer.toLowerCase() === 'u') {
            updateUserData(name);
        } else if (answer.toLowerCase() === 'd') {
            deleteUserData();
        } else {
            console.log('Введено невірну опцію.');
            askUpdateOrDelete(name);
        }
    });
}


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Введіть ім\'я користувача: ', (name) => {
    rl.question('Введіть вік користувача: ', (age) => {
        rl.close();
        writeUserData(name, age);
        readUserData();
    });
});
