"use strict";

const { libs } = nodex;
const { mysql } = libs;

exports.init = async function (args) {
    console.log("data init.");
    console.log("data init args:", args);
    await mysql.init(args.mysql);
};

exports.addTemplate = async function ({ id, name, creator_id, createTime, json , class_id}) {
    const sql = `
        INSERT INTO
            form_template
        VALUES(
            "${id}",
            "${name}",
            "${creator_id}",
            "${createTime}",
            '${json}',
            "${class_id}"
        )
    `;
    return await mysql.query(sql);
}

exports.setTemplateById = async function ({ id, name, creator_id, json, class_id }) {
    const sql = `
        UPDATE
            form_template
        SET
            template_name = "${name}",
            creator_id = "${creator_id}",
            template_json = "${json}",
            class_id = "${class_id}""
        WHERE
            template_id = "${id}"
    `;
    return await mysql.query(sql);
}

exports.selectTemplateById = async function ({ id }) {
    const sql = `
        SELECT
            *
        FROM
            form_template
        WHERE
            template_id = "${id}"
    `;
    return await mysql.query(sql);
}

exports.delTemplateById = async function ({ id }) {
    const sql = `
        DELETE FROM
            form_template
        WHERE
            template_id = "${id}"
    `;
    return await mysql.query(sql);
}


exports.addProperty = async function(propertyListTetx) {
    const sql =`
        INSERT INTO
            form_property
        VALUES
            ${propertyListTetx}
    `;

    return await mysql.query(sql);
}

// 根据TemplateId删除其下的所有属性
exports.delPropertyByTemplateId = async function({id}){
    const sql = `
        DELETE FROM
            form_property
        WHERE
            template_id = "${id}"
    `;
    return await mysql.query(sql);
}

exports.addClass = async function({id, title, name}) {
    const sql = `
        INSERT INTO
            form_class
        VALUES
            ("${id}", "${title}", "${name}")
    `;
    return await mysql.query(sql);
}

exports.addObject = async function({id, class_id, name, createTime}){
    const sql = `
        INSERT INTO
            from_object
        VALUES
            ("${id}", "${class_id}", "${name}", "${createTime}")
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

exports.addObjectValue = async function(objectValueText) {
    const sql =`
        INSERT INTO
            form_object_value
        VALUES
            ${objectValueText}
    `;

    return await mysql.query(sql);
}

exports.updataObjectValue = async function({id, value}) {
    const sql = `
        UPDATE
            form_object_value
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
            form_object_value
        WHERE
            object_id = "${object_id}"
    `;
    return await mysql.query(sql);
}
