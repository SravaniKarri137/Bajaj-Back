const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');  // Import fs to handle file operations
const path = require('path');

const app = express();
app.use(bodyParser.json({ limit: '10mb' }));  // Adjust payload limit for file handling
app.use(cors()); // Enable CORS

const userId = 'Sravani_Karri_13_042004'; 
const email = 'Sravani_karri@srmap.edu.in'; 
const rollNumber = 'AP21110011394'; 

function separateData(data) {
    const numbers = [];
    const alphabets = [];
    let highestLowercaseAlphabet = null;

    data.forEach(item => {
        if (!isNaN(item)) {
            numbers.push(item);
        } else if (typeof item === 'string' && item.length === 1 && /^[A-Za-z]$/.test(item)) {
            alphabets.push(item);
            if (item === item.toLowerCase()) { // Check only lowercase letters
                if (!highestLowercaseAlphabet || item > highestLowercaseAlphabet) {
                    highestLowercaseAlphabet = item;
                }
            }
        }
    });

    return { numbers, alphabets, highestLowercaseAlphabet: highestLowercaseAlphabet ? [highestLowercaseAlphabet] : [] };
}

// Helper function to validate Base64 file
function validateBase64File(file_b64) {
    if (!file_b64) return { valid: false, mimeType: null, size: 0 };

    // Extract file metadata from base64 string
    const matches = file_b64.match(/^data:(.*);base64,(.*)$/);
    if (!matches || matches.length !== 3) return { valid: false, mimeType: null, size: 0 };

    const mimeType = matches[1];  // Extract MIME type
    const buffer = Buffer.from(matches[2], 'base64');  // Create buffer from base64 string
    const sizeKB = (buffer.length / 1024).toFixed(2);  // Calculate size in KB

    return { valid: true, mimeType, size: sizeKB };
}

app.post('/bfhl', (req, res) => {
    const { data, file_b64 } = req.body;

    if (!data || !Array.isArray(data)) {
        return res.status(400).json({ is_success: false, error: 'Invalid input data' });
    }

    // Separate numbers and alphabets
    const { numbers, alphabets, highestLowercaseAlphabet } = separateData(data);

    // File handling logic
    const { valid: fileValid, mimeType, size: fileSizeKB } = validateBase64File(file_b64);

    res.json({
        is_success: true,
        user_id: userId,
        email: email,
        roll_number: rollNumber,
        numbers: numbers,
        alphabets: alphabets,
        highest_lowercase_alphabet: highestLowercaseAlphabet,  // Use correct field name and logic
        file_valid: fileValid,
        file_mime_type: mimeType,
        file_size_kb: fileSizeKB
    });
});

app.get('/bfhl', (req, res) => {
    res.status(200).json({ operation_code: 1 });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
