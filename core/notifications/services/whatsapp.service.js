// WhatsAppService.js
import axios from "axios";
import { constants } from "../../../utils/constants.utils.js";
import loggingService from "../../../services/logging.service.js"; // Adjust the path as necessary

const logger = loggingService.getModuleLogger("WhatsAppService");

class WhatsAppService {
  constructor() {
    this.apiUrl = constants.whatsapp.url;
  }

  /**
   * Sends a WhatsApp text message.
   * @param {string} to - Recipient phone number in international format (e.g., +1234567890).
   * @param {string} message - The message content.
   * @returns {Promise<Object>} - The API response.
   */
  async sendMessage(recipient, message) {
    try {
      logger.info(`Preparing to send message to recipient: ${recipient}`);
      const payload = {
        chatId: `${recipient}@c.us`,
        message
      };

      const response = await axios.post(this.apiUrl, payload, {
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (response.status === 200 || response.status === 201) {
        logger.info("WhatsApp message sent successfully:", response.data);
        return response.data;
      } else {
        logger.error(`WhatsApp API responded with status ${response.status}`);
        throw new Error(
          `WhatsApp API responded with status ${response.status}`
        );
      }
    } catch (error) {
      logger.error(
        "Error sending WhatsApp message:",
        error.response ? error.response.data : error.message
      );
      throw error;
    }
  }
}

const whatsappService = new WhatsAppService();

export default whatsappService;
