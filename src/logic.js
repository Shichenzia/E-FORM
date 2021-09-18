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
 * @param {String} json 表单的json格式
 * @returns 
 */
exports.addTemplate = async function ({ name, creator_id, json, class_id }) {

    fmt.required(name, "string", 1, 64);
    fmt.required(creator_id, "string", 1, 64);
    fmt.required(json, "string", 1);
    fmt.required(class_id, "string", 1);
    const id = idCreate.get();
    const createTime = new Date();


    await data.addTemplate({ id, name, creator_id, createTime, json, class_id });
    return true;
};

exports.updateTemplateById = async function({ id, name, creator_id, json }) {

    fmt.required(id, "string", 1, 64);
    fmt.required(name, "string", 1, 64);
    fmt.required(creator_id, "string", 1, 64);
    fmt.required(json, "string", 1);

    //TODO 当修改表单模板时，直接删除所有的属性 再重新添加
    await data.setTemplateById({ id, name, creator_id, json });

    return true;
}

exports.selectTemplateById = async function({id}) {
    fmt.required(id, "string", 1, 64);

    return await data.selectTemplateById({id});
}

exports.delTemplateById = async function({id}) {
    fmt.required(id, "string", 1, 64);

    await data.delTemplateById({id});

    return true;
}

/**
 * 同时插入多条属性
 * [{ id, name, title, type, template_id },....]
 * @param {Array} propertyList 
 */
 exports.addProperty = async function(propertyList) {
    // 一个表单模板的属性列表不能为空
    fmt.required(propertyList, "array", 1);
    
    let propertyListText = propertyList.map((item, index) => {

        // 去掉在遍历过程中sql多了个逗号 
        if(index === 0) {
            return `(property_id = "${item.id}", property_name = "${item.name}", property_title = "${item.title}", property_type = "${item.type}", template_id="${item.template_id}")`
        }
        return `,(property_id = "${item.id}", property_name = "${item.name}", property_title = "${item.title}", property_type = "${item.type}", template_id="${item.template_id}")`
    })

    await data.addProperty(propertyListText);

    return true;
}

// 根据TemplateId删除其下的所有属性
exports.delPropertyByTemplateId = async function({id}){
    fmt.required(id, "string", 1, 64);

    await data.delPropertyByTemplateId({id});

    return true;
}

exports.addClass = async function({name, title}) {
    fmt.required(name, "string", 1, 64);
    fmt.required(title, "string", 1, 64);
    const id = idCreate.get();

    await data.addClass({id, title, name});

    return true;
}

exports.addObject = async function({class_id, name}) {
    fmt.required(class_id, "string", 1, 64);
    fmt.required(name, "string", 1, 64);
    const id = idCreate.get();
    const createTime = new Date();

    await data.addObject({id, class_id, name, createTime});

    return true;
}

exports.updateObjectById = async function({id, class_id, name}){
    fmt.required(id, "string", 1, 64);
    fmt.required(class_id, "string", 1, 64);
    fmt.required(name, "string", 1, 64);

    await data.updateObjectById({id, class_id, name});

    return true;
}

/**
 * 往同一对象中同时插入多条关于值得数据
 * [{ property_id, value },....], object_id
 * @param {Array} propertyList 
 */
exports.addObjectValue = async function(objectValue, object_id) {
    fmt.required(object_id, "string", 1, 64);
    fmt.required(objectValue, "array", 1);

    let objectValueText = objectValue.map((item, index) => {
        const id = idCreate.get();
        if(index === 0){
            return `(${id}, ${item.property_id}, ${item.value}, ${object_id})`;
        }

        return `,(${id}, ${item.property_id}, ${item.value}, ${object_id})`;
    })

    await data.addObjectValue(objectValueText);

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