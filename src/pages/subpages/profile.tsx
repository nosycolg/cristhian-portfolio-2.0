import profileIcon from "../../assets/profile.jpeg";
import Markdown from "markdown-to-jsx";

function Profile() {
  const markdownContent = `
  <h1 align="center">Hey 👋, My name is Cristhian Felipe</h1>
  <h2 align="center">Evolving more every day!</h2>
  
  <div align="center" style="display: flex; justify-content: center; flex-wrap: wrap; gap: 6px">
    
  ![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=flat&logo=css3&logoColor=white) 
  ![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=flat&logo=html5&logoColor=white) 
  ![Markdown](https://img.shields.io/badge/markdown-%23000000.svg?style=flat&logo=markdown&logoColor=white) 
  ![Python](https://img.shields.io/badge/python-3670A0?style=flat&logo=python&logoColor=ffdd54) 
  ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=flat&logo=typescript&logoColor=white) 
  ![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=flat&logo=javascript&logoColor=%23F7DF1E) 
  ![Firebase](https://img.shields.io/badge/firebase-%23039BE5.svg?style=flat&logo=firebase) 
  ![AWS](https://img.shields.io/badge/AWS-%23FF9900.svg?style=flat&logo=amazon-aws&logoColor=white) 
  ![Azure](https://img.shields.io/badge/azure-%230072C6.svg?style=flat&logo=microsoftazure&logoColor=white) 
  ![GithubPages](https://img.shields.io/badge/github%20pages-121013?style=flat&logo=github&logoColor=white) 
  ![Angular.js](https://img.shields.io/badge/angular.js-%23E23237.svg?style=flat&logo=angularjs&logoColor=white) 
  ![Angular](https://img.shields.io/badge/angular-%23DD0031.svg?style=flat&logo=angular&logoColor=white) 
  ![AdonisJS](https://img.shields.io/badge/adonisjs-%23220052.svg?style=flat&logo=adonisjs&logoColor=white) 
  ![Bootstrap](https://img.shields.io/badge/bootstrap-%238511FA.svg?style=flat&logo=bootstrap&logoColor=white) 
  ![Chakra](https://img.shields.io/badge/chakra-%234ED1C5.svg?style=flat&logo=chakraui&logoColor=white) 
  ![Chart.js](https://img.shields.io/badge/chart.js-F5788D.svg?style=flat&logo=chart.js&logoColor=white) 
  ![Electron.js](https://img.shields.io/badge/Electron-191970?style=flat&logo=Electron&logoColor=white) 
  ![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=flat&logo=express&logoColor=%2361DAFB) 
  ![Expo](https://img.shields.io/badge/expo-1C1E24?style=flat&logo=expo&logoColor=#D04A37) 
  ![Fastify](https://img.shields.io/badge/fastify-%23000000.svg?style=flat&logo=fastify&logoColor=white) 
  ![Insomnia](https://img.shields.io/badge/Insomnia-black?style=flat&logo=insomnia&logoColor=5849BE) 
  ![jQuery](https://img.shields.io/badge/jquery-%230769AD.svg?style=flat&logo=jquery&logoColor=white) 
  ![JWT](https://img.shields.io/badge/JWT-black?style=flat&logo=JSON%20web%20tokens) 
  ![Metero JS](https://img.shields.io/badge/meteorjs-%23d74c4c.svg?style=flat&logo=meteor&logoColor=white) 
  ![React Native](https://img.shields.io/badge/react_native-%2320232a.svg?style=flat&logo=react&logoColor=%2361DAFB) 
  ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=flat&logo=node.js&logoColor=white) 
  ![Next JS](https://img.shields.io/badge/Next-black?style=flat&logo=next.js&logoColor=white) 
  ![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=flat&logo=nestjs&logoColor=white) 
  ![React Router](https://img.shields.io/badge/React_Router-CA4245?style=flat&logo=react-router&logoColor=white) 
  ![React Hook Form](https://img.shields.io/badge/React%20Hook%20Form-%23EC5990.svg?style=flat&logo=reacthookform&logoColor=white) 
  ![Redux](https://img.shields.io/badge/redux-%23593d88.svg?style=flat&logo=redux&logoColor=white) 
  ![React Query](https://img.shields.io/badge/-React%20Query-FF4154?style=flat&logo=react%20query&logoColor=white) 
  ![RollupJS](https://img.shields.io/badge/RollupJS-ef3335?style=flat&logo=rollup.js&logoColor=white) 
  ![RxJS](https://img.shields.io/badge/rxjs-%23B7178C.svg?style=flat&logo=reactivex&logoColor=white) 
  ![Semantic UI React](https://img.shields.io/badge/Semantic%20UI%20React-%2335BDB2.svg?style=flat&logo=SemanticUIReact&logoColor=white) 
  ![SolidJS](https://img.shields.io/badge/SolidJS-2c4f7c?style=flat&logo=solid&logoColor=c8c9cb) 
  ![Styled Components](https://img.shields.io/badge/styled--components-DB7093?style=flat&logo=styled-components&logoColor=white) 
  ![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=flat&logo=tailwind-css&logoColor=white) 
  ![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=flat&logo=vite&logoColor=white) 
  ![Vue.js](https://img.shields.io/badge/vue.js-%2335495e.svg?style=flat&logo=vuedotjs&logoColor=%234FC08D) 
  ![Webpack](https://img.shields.io/badge/webpack-%238DD6F9.svg?style=flat&logo=webpack&logoColor=black) 
  ![NPM](https://img.shields.io/badge/NPM-%23CB3837.svg?style=flat&logo=npm&logoColor=white) 
  ![MySQL](https://img.shields.io/badge/mysql-%2300000f.svg?style=flat&logo=mysql&logoColor=white) 
  ![Firebase](https://img.shields.io/badge/Firebase-039BE5?style=flat&logo=Firebase&logoColor=white) 
  ![Adobe After Effects](https://img.shields.io/badge/Adobe%20After%20Effects-9999FF.svg?style=flat&logo=Adobe%20After%20Effects&logoColor=white) 
  ![Adobe Premiere Pro](https://img.shields.io/badge/Adobe%20Premiere%20Pro-9999FF.svg?style=flat&logo=Adobe%20Premiere%20Pro&logoColor=white) 
  ![Adobe Photoshop](https://img.shields.io/badge/adobe%20photoshop-%2331A8FF.svg?style=flat&logo=adobe%20photoshop&logoColor=white) 
  ![Adobe Lightroom Classic](https://img.shields.io/badge/Adobe%20Lightroom%20Classic-31A8FF.svg?style=flat&logo=Adobe%20Lightroom%20Classic&logoColor=white) 
  ![Canva](https://img.shields.io/badge/Canva-%2300C4CC.svg?style=flat&logo=Canva&logoColor=white) 
  ![Gimp](https://img.shields.io/badge/Gimp-657D8B?style=flat&logo=gimp&logoColor=FFFFFF) 
  ![Adobe Lightroom](https://img.shields.io/badge/Adobe%20Lightroom-31A8FF.svg?style=flat&logo=Adobe%20Lightroom&logoColor=white) 
  ![AZUREDEVOPS](https://img.shields.io/badge/azuredevops-0078D7.svg?style=flat&logo=azuredevops&logoColor=white&color=%230078D7) 
  ![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=flat&logo=docker&logoColor=white) 
  ![ESLint](https://img.shields.io/badge/ESLint-4B3263?style=flat&logo=eslint&logoColor=white) 
  ![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=flat&logo=docker&logoColor=white) 
  ![Postman](https://img.shields.io/badge/Postman-FF6C37?style=flat&logo=postman&logoColor=white) 
  ![Trello](https://img.shields.io/badge/Trello-%23026AA7.svg?style=flat&logo=Trello&logoColor=white)

  </div>
  
  <div align="center">
  <div style="display: flex; justify-content: center; flex-wrap: wrap; gap: 6px">

  ![](https://github-readme-streak-stats.herokuapp.com/?user=nosycolg&theme=dark&hide_border=false)
  ![](https://github-readme-stats.vercel.app/api/top-langs/?username=nosycolg&theme=dark&hide_border=false&include_all_commits=true&count_private=true&layout=compact)
  
  </div>
  </div>`;

  return (
    <>
        <div className="items-center grid w-full grid-cols-12 gap-4 p-4 overflow-y-auto">
          <div className="col-span-12 sm:col-span-4 rounded-2xl">
            <img className="w-full rounded-2xl" src={profileIcon} />
          </div>
          <div className="col-span-12 rounded-lg  sm:col-span-8">
            <Markdown>{markdownContent}</Markdown>
          </div>
        </div>
    </>
  );
}

export default Profile;
