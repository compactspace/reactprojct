

const noneusermodel = require('../reactmodel/noneusermodel')


module.exports.openclassinfoService =async(req, res)=>{

    return await noneusermodel.openclassinfoModel(req, res);
};

module.exports.OnedayclassRestService=async(req, res)=>{

    return await noneusermodel.OnedayclassRestModel(req, res);
};



module.exports.justregisterOnedayclassinfoService =async(req, res)=>{

    return await noneusermodel.justregisterOnedayclassinfoModel(req, res);
};





module.exports.IsMagamService =async(req, res)=>{

    return await noneusermodel.IsMagamModel(req, res);
};




module.exports.FindOutRestService =async(req, res)=>{

    return await noneusermodel.FindOutRestModel(req, res);
};

