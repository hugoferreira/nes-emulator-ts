VMEM = $F000
CODE = $200

  .org $0
  .org CODE

start:
  lda #$1
  ldx #$0
strip:
  sta VMEM, X
  inx
  inx
  cpx #$0
  bne strip

  lda #$0
  ldx #$0
clear:
  sta VMEM, X
  inx
  cpx #$ff
  bne clear

  jmp start

  .org $fffc
  .word CODE
  .word $0000
