/**
 * Simple hard disk reader and parser in JS
 * 
 * Inspired by:
 * 
 * https://github.com/skeledrew/ext4-raw-reader
 */
const { execSync } = require('child_process')
const DD_BS = 4096  // Bytes read & written by dd

function exec(cmd) {
    const stdout = execSync(cmd)
    return stdout
}

function dd_read(in_file, count=1, skip=0) {
    return exec('sudo dd bs='+ DD_BS +' if=' + in_file + ' status=none skip=' + skip + ' count=' + count + ' | hexdump -Cv')
}

/**
 * Move hexdump result from dd_read in to a parsable 
 * array of the lines with the raw hex data
 * 
 * Output ex: ['0f', 'a1', ...... e.g. 512 bytes]
 */
function parse_hexdump_result(in_file) {
    const data = dd_read(in_file).toString()
    const lines = data.split('\n')
    const bytes = []

    for (const line of lines) {
        const tmp = line.split('  ')
        if (tmp.length <= 1) continue

        const rawData = tmp[1] + ' ' + tmp[2]
        const rawHexValues = rawData.split(' ')

        for (const hexValue of rawHexValues) {
            bytes.push(hexValue)
        }
        
    }
    // 521 :D
    // console.log(bytes.length);

    return bytes
}

// ===== MAIN =====
const DISK = '/dev/sdb'

// const data = dd_read(DISK).toString()
// console.log(data, data.length);

const bytes = parse_hexdump_result(DISK)

console.log(bytes);