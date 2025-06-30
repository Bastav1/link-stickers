export default function random(){
    let str:String="";
    for(let i=0;i<10;i++){
        str+='a'+Math.ceil(Math.random()*100);
    }
    let s2:String="";
     for(let i=0;i<10;i++){
        s2+=str[i];
    }
    return s2;
}