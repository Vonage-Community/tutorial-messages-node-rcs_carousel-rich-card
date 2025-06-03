const express = require('express');
const fs = require('fs');
const dotenv = require('dotenv');
const { Vonage } = require('@vonage/server-sdk');
const { verifySignature } = require('@vonage/jwt');

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

const VONAGE_API_SIGNATURE_SECRET = process.env.VONAGE_API_SIGNATURE_SECRET;

const privateKey = fs.readFileSync(process.env.VONAGE_PRIVATE_KEY);

const vonage = new Vonage({
  applicationId: process.env.VONAGE_APPLICATION_ID,
  privateKey: privateKey
});

app.post('/send-rcs-carousel', async (req, res) => {
  const toNumber = req.body.to;

  const message = {
    to: toNumber,
    from: process.env.RCS_SENDER_ID,
    channel: 'rcs',
    message_type: 'custom',
    custom: {
      contentMessage: {
        richCard: {
          carouselCard: {
            cardWidth: "MEDIUM",
            cardContents: [
              {
                title: "Fashion Popup Launch 🎉",
                description: "Join us this weekend for limited drops & exclusive looks.",
                media: {
                  height: "TALL",
                  contentInfo: {
                    fileUrl: "https://raw.githubusercontent.com/Vonage-Community/tutorial-messages-node-rcs_carousel-rich-card/main/rcs-fashion-video.gif",
                    thumbnailUrl: "https://raw.githubusercontent.com/Vonage-Community/tutorial-messages-node-rcs_carousel-rich-card/main/rcs-fashion-thumbnail.png",
                    forceRefresh: true
                  }
                },
                suggestions: [
                  {
                    "action": {
                      "text": "Save the Date",
                      "postbackData": "save_event",
                      "fallbackUrl": "https://www.google.com/calendar",
                      "createCalendarEventAction": {
                        "startTime": "2024-06-28T19:00:00Z",
                        "endTime": "2024-06-28T20:00:00Z",
                        "title": "Fashion Popup Launch",
                        "description": "Join us this weekend for limited drops & exclusive looks."
                      }
                    }
                  },
                  {
                    action: {
                      text: "See Location",
                      postbackData: "view_location",
                      openUrlAction: {
                        url: "https://maps.google.com/?q=Galleria+Vittorio+Emanuele+II,+Milan,+Italy"
                      }
                    }
                  }
                ]
              },
              {
                title: "Drop 01: T-Shirts",
                description: "Bold graphics. Oversized fit. Designed to stand out.",
                media: {
                  height: "TALL",
                  contentInfo: {
                    fileUrl: "https://raw.githubusercontent.com/Vonage-Community/tutorial-messages-node-rcs_carousel-rich-card/main/rcs-fashion-tshirt.png"
                  }
                },
                suggestions: [
                  {
                    action: {
                      text: "See All",
                      postbackData: "see_tshirts",
                      openUrlAction: {
                        url: "https://github.com/Vonage-Community/tutorial-messages-node-rcs_carousel-rich-card/blob/main/rcs-fashion-tshirt.png"
                      }
                    }
                  }
                ]
              },
              {
                title: "Drop 02: Hats",
                description: "Top off your look. Fresh colors, bold logos.",
                media: {
                  height: "TALL",
                  contentInfo: {
                    fileUrl: "https://raw.githubusercontent.com/Vonage-Community/tutorial-messages-node-rcs_carousel-rich-card/main/rcs-fashion-hat.png",
                  }
                },
                suggestions: [
                  {
                    action: {
                      text: "See All",
                      postbackData: "see_hats",
                      openUrlAction: {
                        url: "https://github.com/Vonage-Community/tutorial-messages-node-rcs_carousel-rich-card/blob/main/rcs-fashion-hat.png"
                      }
                    }
                  }
                ]
              }
            ]
          }
        }
      }
    }
  };

  try {
    const response = await vonage.messages.send(message);
    console.log("Carousel sent:", response);
    res.status(200).json({ message: "Carousel sent successfully." });
    console.log("Vonage API response:", JSON.stringify(response, null, 2));
  } catch (error) {
    console.error("Error sending carousel:", error);
    res.status(500).json({ error: "Failed to send carousel." });
  }
});


app.post('/inbound_rcs', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!verifySignature(token, VONAGE_API_SIGNATURE_SECRET)) {
    res.status(401).end();
    return;
  }

  const inboundMessage = req.body;

  if (inboundMessage.channel === 'rcs' && inboundMessage.message_type === 'button') {
    const userAction = inboundMessage.button.payload;
    const userNumber = inboundMessage.from;

    console.log(`User ${userNumber} tapped action: ${userAction}`);
  }

  res.status(200).end();
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
