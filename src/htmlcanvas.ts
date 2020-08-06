export class HTMLCanvasVideoMem {
  private videobuffer: DataView
  private sctx: CanvasRenderingContext2D
  private dctx: CanvasRenderingContext2D
  private image: ImageData
  private dcanvas: HTMLCanvasElement

  constructor(width = 64, height = 32, public videomem = new Uint8Array(width * height), screenWidth = 640, screenHeight = 320) {
    const xScale = screenWidth / width
    const yScale = screenHeight / height

    const scanvas = <HTMLCanvasElement> document.getElementById('maincanvas')
    this.dcanvas = <HTMLCanvasElement> document.createElement('canvas')

    this.sctx = scanvas.getContext('2d')!
    this.dctx = this.dcanvas.getContext('2d')!

    this.dcanvas.width = width
    this.dcanvas.height = height
    this.sctx.scale(xScale, yScale)
    this.sctx.imageSmoothingEnabled = false

    this.image = this.dctx.createImageData(width, height)
    this.videobuffer = new DataView(this.image.data.buffer)
  }

  refresh() {
    requestAnimationFrame(() => this.refresh())

    for (let i = 0, j = 0; i < this.videomem.length; i += 1, j += 4) {
      // const dst = (videomem[i] !== 0) ? 0xfaf655FF : 0x420000FF // palette[videomem[i]]
      const dst = (this.videomem[i] != 0) ? 0x88ba6aFF : 0x446b2cFF // palette[videomem[i]]
      this.videobuffer.setUint32(j, dst)
    }

    this.dctx.putImageData(this.image, 0, 0)
    this.sctx.drawImage(this.dcanvas, 0, 0)
  }
}