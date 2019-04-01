const cloneDeep = require('clone-deep');

// Safe clone done prior to ingestion to prevent issues f
// from cloning a WS type
const ingest = (bot, payload, source) => {
	payload.raw_message = source.raw;
	payload.message = cloneDeep(source.raw);
	return payload;
};

module.exports.handler = (bot, opayload, source, next) => {
	ingest(bot, opayload, source);
	next();
}

module.exports.exec = ingest;
