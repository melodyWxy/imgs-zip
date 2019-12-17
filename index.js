const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

class Zip{
    constructor(props){
        this.sourceDir = props.sourceDir;
        this.outDir = props.outDir;
        this.fiberZip();
    }
    fiberZip (){
        //任务分段，异步进行，批量处理
        const imgSrcList = fs.readdirSync(this.sourceDir);
        //获取sourceDir下的图片数量 
        const length = imgSrcList.length;
            for(let j=0;j<length;j++){
                setTimeout(()=>{
                    const sourceSrc = imgSrcList[j];
                    if(sourceSrc==='.DS_Store'){
                        return null;
                    }
                    if(!sourceSrc){
                        return null;
                    }
                    // console.log(`${this.sourceDir}/${sourceSrc}`);
                    const filePath = `${this.sourceDir}/${sourceSrc}`;
                    const strs  =  fs.readFileSync(filePath) ;
                    const sLength = Buffer.byteLength(strs,'utf8');
                    if(sLength<400000){
                        //没有必要做优化
                        fs.writeFileSync(`${this.outDir}/${sourceSrc}`,strs);
                        return null;
                    }

                    if(sourceSrc.indexOf('.pn')){
                        //png转jpg
                        sharp(filePath)
                        .resize(800, 800)
                          .jpeg()
                        .toFile(`${this.outDir}/${sourceSrc}.jpg`,(err, info) => {
                            if(err){
                                console.log(filePath)
                            }else{
                            }
                        })  
                    }else{
                        sharp(filePath)
                        .resize(800, 800)
                        .toFile(`${this.outDir}/${sourceSrc}`,(err, info) => {
                            if(err){
                                console.log(`
                                    这个图片没有压缩成功:${filePath} \t
                                    错误原因：\t
                                    ${info}
                                `)
                            }else{
                            }
                        })
                    }
                },100*j)
            }

    }
}


// const  sourceDir =  path.resolve(__dirname,'./outThat'); 
// const  outDir = path.resolve(__dirname,'./outThis');
// new Zip({sourceDir,outDir});