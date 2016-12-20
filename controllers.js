'use strict'

const TelegramBaseController = Telegram.TelegramBaseController

class PingController extends TelegramBaseController {
    /**
     * @param {Scope} $
     */
    pingHandler($) {
        $.sendMessage('pong')
    }

    get routes() {
        return {
            'pingCommand': 'pingHandler'
        }
    }
}

module.exports = {
    PingController: PingController,
};