import { MOS6502Emulator, AddressBus, TAddress, TData } from './6502/cpu'
import { HTMLCanvasVideoMem } from './htmlcanvas'
import { readFileSync } from 'fs'

function load(mem: Uint8Array, program: Uint8Array, offset: number = 0) {
    program.forEach((v, ix) => mem[ix + offset] = v)
    if (offset != 0) {
        mem[0xFFFC] = (offset & 0x00FF)
        mem[0xFFFD] = (offset & 0xFF00) >> 8
    }
}

const width = 64
const height = 32
const fps = 60    // 60Hz
const cpuFreq = 100 // 1Hz
const videomem = new Uint8Array(width * height)
const ram = new Uint8Array(0x10000)

const bus = new class implements AddressBus {
    constructor(public videoBaseAddress: number = 0xF000) { }

    read(addr: TAddress): TData { return ram[addr] }
    write(addr: TAddress, data: TData) { 
        ram[addr] = data 
        if (addr >= this.videoBaseAddress && addr < this.videoBaseAddress + videomem.length) 
            videomem[addr - this.videoBaseAddress] = data
    }
}

const cpu = new MOS6502Emulator(bus)
const video = new HTMLCanvasVideoMem(width, height, videomem)

load(ram, readFileSync('asm/videomem.bin', null))

window.onload = () => {
    cpu.reset()
    setInterval(() => { cpu.clock() }, 1000 / cpuFreq)
    window.setTimeout(() => video.refresh(), 1000 / fps)
}