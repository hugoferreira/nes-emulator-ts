import { MOS6502Emulator, AddressBus, TAddress, TData } from './6502/cpu'
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

const cpu = new MOS6502Emulator(bus)

cpu.reset()

setInterval(() => { cpu.clock() }, 1000)
