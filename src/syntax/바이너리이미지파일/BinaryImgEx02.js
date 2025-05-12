
global.Buffer = global.Buffer || require('buffer').Buffer;
export const BinaryImgEx02 = () => {

    const buffer = Buffer.from('Hello world')
    console.log('from() : ', buffer)
    console.log('length : ', buffer.length)
    console.log('toString() : ', buffer.toString())

    const array = [Buffer.from('Node.js '), Buffer.from('buffer '), Buffer.from('concat '), Buffer.from('array')]
    const buffer2 = Buffer.concat(array)
    console.log('concat(), toString() : ', buffer2.toString())

    const buffer3 = Buffer.alloc(5)
    console.log('length : ', buffer3.length)



    return (<></>);


} 