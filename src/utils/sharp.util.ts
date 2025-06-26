import sharp from 'sharp'

const resizeImage = async (buffer: Buffer) => {
     try {

      console.log("resize invoked");
      return await sharp(buffer)
      .resize({ width: 200, height: 200, fit: 'contain'})
      .toBuffer();
        
     } catch (error) {
        console.log(error)
     }
}

export { resizeImage };