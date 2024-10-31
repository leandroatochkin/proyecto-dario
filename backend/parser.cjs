const parseFileData = (fileData, type) => {
    const rows = fileData.split(';').filter(line => line.trim());
    return rows.map(row => {
        const columns = row.split('|').map(col => col.trim());
        
        if (type === 'rubro') {
            return {
                RB_cod_raz: columns[0],
                RB_cod_suc: columns[1],
                RB_cod_rub: columns[2],
                RB_des_rub: columns[3],
                RB_est: columns[4]
            };
        } else if (type === 'producto') {
            return {
                PD_cod_raz_soc: columns[0],
                PD_cod_suc: columns[1],
                PD_cod_pro: columns[2],
                PD_des_pro: columns[3],
                PD_cod_rub: columns[4],
                PD_pre_ven: parseFloat(columns[5]),
                PD_ubi_imagen: columns[6],
                PD_est: columns[7]
            };
        } else if (type === 'estado_pedido') {
            return {
                EP_cod_raz_soc: columns[0],
                EP_cod_suc: columns[1],
                EP_fecha: columns[2],
                EP_nro_ped: columns[3],
                EP_tot_fin: parseFloat(columns[4]),
                EP_comision: parseFloat(columns[5]),
                EP_est: parseInt(columns[6])
            };
        }
    });
};

module.exports =  parseFileData;
