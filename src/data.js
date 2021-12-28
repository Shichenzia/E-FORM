"use strict";

const { libs } = nodex;
const { mysql } = libs;

exports.init = async function (args) {
    console.log("data init.");
    console.log("data init args:", args);
    await mysql.init(args.mysql);
};

exports.addTemplate = async function ({ id, name, creator_id, createTime, FcDesignerRuleJson, FcDesignerOptionsJson, class_id }) {
    const sql = `
        INSERT INTO
            t_template
        VALUES(
            "${id}",
            "${name}",
            "${creator_id}",
            "${createTime}",
            '${FcDesignerRuleJson}',
            '${FcDesignerOptionsJson}',
            "${class_id}"
        )
    `;
    return await mysql.query(sql);
}

exports.getTemplateById = async function ({ id }) {
    const sql = `
        SELECT
            *
        FROM
            t_template
        WHERE
            c_id = "${id}"
    `;
    return await mysql.query(sql);
}

exports.setTemplateById = async function ({ id, name, FcDesignerRuleJson, FcDesignerOptionsJson, class_id }) {
    const sql = `
        UPDATE
            t_template
        SET
            c_name = "${name}",
            FcDesignerRuleJson = '${FcDesignerRuleJson}',
            FcDesignerOptionsJson = '${FcDesignerOptionsJson}',
            c_class_id = "${class_id}"
        WHERE
            c_id = "${id}"
    `;
    return await mysql.query(sql);
}

exports.delTemplateById = async function ({ id }) {
    const sql = `
        DELETE FROM
            t_template
        WHERE
            c_template_id = "${id}"
    `;
    return await mysql.query(sql);
}

exports.addProperty = async function(propertyListTetx) {
    const sql =`
        INSERT INTO
            t_property
        VALUES
            ${propertyListTetx}
    `;

    return await mysql.query(sql);
}

// 根据TemplateId删除其下的所有属性
exports.delPropertyByTemplateId = async function({id}){
    const sql = `
        DELETE FROM
            t_property
        WHERE
            c_template_id = "${id}"
    `;
    return await mysql.query(sql);
}

// 添加表单实例对象
exports.addObject = async function({id, fromTemplateid, ctime, mtime, name = ""}){
    const sql = `
        INSERT INTO
            t_object
        VALUES
            ("${id}", "${fromTemplateid}", "${name}", "${ctime}", "${mtime}")
    `;
    return await mysql.query(sql);
}

// 为表单实例对象添加值
exports.addObjectValue = async function({ id, value, objectId, propertyId }) {
    const sql =`
        INSERT INTO
            t_object_value
        VALUES
            ("${id}", "${propertyId}", "${value}", "${objectId}")
    `;

    return await mysql.query(sql);
}

exports.getObjectValuesById = async function ({ objectId }) {
    const sql = `
        SELECT
            *
        FROM
            t_object_value o, t_property p
        WHERE
            o.c_object_id = "${objectId}" and o.c_property_id = p.c_id
    `;
    return await mysql.query(sql);
}









exports.addClass = async function({id, title, name}) {
    const sql = `
        INSERT INTO
            t_class
        VALUES
            ("${id}", "${title}", "${name}")
    `;
    return await mysql.query(sql);
}



exports.updateObjectById = async function({id, class_id, name}) {
    const sql = `
        UPDATE
            from_object
        SET
            object_name = "${name}",
            class_id = "${class_id}",
        WHERE
            object_id = "${id}"
    `;
    return await mysql.query(sql);
}

exports.updataObjectValue = async function({id, value}) {
    const sql = `
        UPDATE
            t_object_value
        SET
            value = "${value}",
        WHERE
            obj_value_id = "${id}"
    `;
    return await mysql.query(sql);
}

exports.selectObjectValueByObjectId = async function ({ object_id }) {
    const sql = `
        SELECT
            *
        FROM
            t_object_value
        WHERE
            object_id = "${object_id}"
    `;
    return await mysql.query(sql);
}


