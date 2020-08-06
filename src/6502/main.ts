import { MOS6502Emulator, AddressBus, TAddress, TData } from './cpu'
import { dumpRAM, dumpRegisters } from './repl'
import { readFileSync } from 'fs'

function load(mem: Uint8Array, program: Uint8Array, offset: number = 0) {
    program.forEach((v, ix) => mem[ix + offset] = v)
    mem[0xFFFC] = (offset & 0x00FF)
    mem[0xFFFD] = (offset & 0xFF00) >> 8
}

const ram = new Uint8Array(0xFFFF)
const bus = new class implements AddressBus {
    read(addr: TAddress): TData { return ram[addr] }
    write(addr: TAddress, data: TData) { ram[addr] = data }
}
const s = new MOS6502Emulator(bus)
load(ram, new Uint8Array([
    0x20, 0x49, 0x00, 0x20, 0x4E, 0x00, 0x4C, 0x53,
    0x00, 0xA2, 0x0A, 0xA0, 0x14, 0x60, 0xCA, 0x88,
    0xD0, 0xFC, 0x60, 0xA9, 0x01, 0x8D, 0x00, 0x00
]), 0x0040)

s.reset()

/* const file = readFileSync('./6502_functional_test.bin', null)
load(ram, file)
s.reset()
s.PC = 0x400 */

setInterval(() => {
    s.clock()

    console.clear()
    dumpRAM(ram, s.addr_abs, s.PC)
    console.log()
    dumpRegisters(s.A, s.X, s.Y, s.IR, s.PC, s.SP, s.STATUS)
    console.log()
}, 1000)
