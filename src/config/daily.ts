import * as cron from 'node-cron';

import {fetchMunicipioData} from '../controller/metereologiaController'
import { getMunicipiosService} from '../service/metereologiaService'
import { municipios } from '@prisma/client';



function tareaCron(){
    cron.schedule('00 9 * * *',  () => {
        console.log('running a task every day at 9:00 am');
        actualizarInfoDiaria();
    });
    
}


async function actualizarInfoDiaria(){
    const municipios: municipios[]= await getMunicipiosService();
    
    for (const municipio of municipios) {
        fetchMunicipioData(municipio.id);
    }
}

export {tareaCron} 
