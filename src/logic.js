"use strict";

const { libs, runtime } = nodex;
const { data } = runtime;
const { fmt, flakes } = libs;

const idCreate = flakes.create();

exports.init = async function (args) {
  console.log("logic init.");
  console.log("logic init args:", args);
};

exports.helloWorld = async function () {
  return "hello world!";
};

/**
 * 添加模板
 * @param {String} name 模板名称
 * @param {String} creator_id 创建者id
 * @param {String} FcDesignerRuleJson 表单的json格式
 * @param {String} FcDesignerOptionsJson 表单的json格式
 * @param {String} class_id 类型id
 * @returns 
 */
exports.addTemplate = async function ({ name, creator_id, FcDesignerRuleJson, FcDesignerOptionsJson, class_id }) {
    fmt.required(name, "string", 1, 64);
    fmt.required(creator_id, "string", 1, 64);
    fmt.required(FcDesignerRuleJson, "string", 1);
    fmt.required(FcDesignerOptionsJson, "string", 1);
    fmt.required(class_id, "string", 1);
    const id = idCreate.get();
    const createTime = formatDate(new Date());

    // 添加表单模板
    await data.addTemplate({ id, name, creator_id, createTime, FcDesignerRuleJson, FcDesignerOptionsJson, class_id });

    // 设置表单模板下的属性
    await addProperty(JSON.parse(FcDesignerRuleJson), id);

    return id;
};

exports.getTemplateById = async function({id}) {
    fmt.required(id, "string", 1, 64);

    return await data.getTemplateById({id});
}

exports.setTemplateById = async function({
    id,
    name,
    FcDesignerRuleJson,
    FcDesignerOptionsJson,
    class_id
}) {
    fmt.required(id, "string", 1, 255);
    fmt.required(name, "string", 1, 255);
    fmt.required(FcDesignerRuleJson, "string", 1);
    fmt.required(FcDesignerOptionsJson, "string", 1);
    fmt.required(class_id, "string", 1);

    // 删除原有表单下的属性表
    await data.delPropertyByTemplateId({ id });

    // 在添加设置的表单模板下的属性
    await addProperty(JSON.parse(FcDesignerRuleJson), id);

    // 设置表单模板
    await data.setTemplateById({ id, name, FcDesignerRuleJson, FcDesignerOptionsJson, class_id });

    return true;
}

exports.delTemplateById = async function({id}) {
    fmt.required(id, "string", 1, 64);

    // 删除表单模板
    await data.delTemplateById({ id });

    // 删除表单模板下的属性
    await data.delPropertyByTemplateId({ id });

    return true;
}

/**
 * 同时插入多条属性
 * [{ id, title },....]
 * @param {Array} propertyList 表单属性列表
 * @param {String} template_id 表单模板id
 */
async function addProperty(propertyList, template_id) {
    console.log(propertyList);
    // 一个表单模板的属性列表不能为空
    fmt.required(propertyList, "array", 1);
    let propertyListTextArray = [];
    propertyList.map((item) => {
        if(item.field){
            propertyListTextArray.push(`("${item.field}", "${item.title}", "${template_id}")`);
        }
    })

    await data.addProperty(propertyListTextArray.join(','));

    return true;
}

// 根据TemplateId删除其下的所有属性
exports.delPropertyByTemplateId = async function({ id }){
    fmt.required(id, "string", 1, 64);

    await data.delPropertyByTemplateId({id});

    return true;
}

/**
 * 添加表单实例对象
 * @param {*} param0 
 * @returns 
 */
exports.addObject = async function({ fromTemplateid }) {
    fmt.required(fromTemplateid, "string", 1, 64);

    const id = idCreate.get();
    await data.addObject({id, fromTemplateid, ctime: formatDate(new Date()), mtime: formatDate(new Date())});
    return id;
}

/**
 * 为表单实例对象添加值
 * @param {String} objectId 对象id
 * @param {Object} formData 属性值对象列表
 * @returns 
 */
exports.addObjectValues = async function({ objectId, formData }) {
    fmt.required(objectId, "string", 1, 64);
    fmt.required(formData, "object", 1);

    for(let key in formData) {
        const id =idCreate.get();
        await data.addObjectValue({ id, value: formData[key], objectId, propertyId: key })
    }
    return true;
}


 exports.getObjectValuesById = async function({ objectId }) {
    fmt.required(objectId, "string", 1, 64);

    const ObjectValues = data.getObjectValuesById({ objectId });
    return ObjectValues;
}





// 添加表单分类
exports.addClass = async function({name, title}) {
    fmt.required(name, "string", 1, 64);
    fmt.required(title, "string", 1, 64);
    const id = idCreate.get();

    await data.addClass({id, title, name});

    return true;
}
exports.updateObjectById = async function({id, class_id, name}){
    fmt.required(id, "string", 1, 64);
    fmt.required(class_id, "string", 1, 64);
    fmt.required(name, "string", 1, 64);

    await data.updateObjectById({id, class_id, name});

    return true;
}

// 根据属性id更新值
exports.updataObjectValue = async function({id, value}){
    fmt.required(id, "string", 1, 64);
    fmt.required(value, "string", 1, 255);

    await data.updataObjectValue({id, value});

    return true;
}

// 根据对象id查询该表下的所有属性值
exports.selectObjectValueByObjectId = async function({object_id}) {
    fmt.required(object_id, "string", 1, 64);

    return await data.selectObjectValueByObjectId({object_id});
}

/**
 * 对日期格式进行处理 xxxx-xx-xx xx:xx
 * @param {Date} date 日期
 * @returns {string} 出理后的日期
 */
function formatDate(date) {
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? "0" + m : m;
    var d = date.getDate();
    d = d < 10 ? "0" + d : d;
    var h = date.getHours();
    h = h < 10 ? "0" + h : h;
    var minute = date.getMinutes();
    minute = minute < 10 ? "0" + minute : minute;
    var second = date.getSeconds();
    second = second < 10 ? "0" + second : second;
    return y + "-" + m + "-" + d + " " + h + ":" + minute + ":" + second;
}
