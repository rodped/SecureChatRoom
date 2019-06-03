import React, { Component } from 'react'
import ScrollableFeed from 'react-scrollable-feed'

var key = 'real secret keys should be long and random';
var encryptor = require('simple-encryptor')(key);

class MessagesList extends Component {
  render() {
    const styles = {
      container: {
        // overflowY: 'scroll',
        // flex: 1,
        height: 600,
      },
      ul: {
        listStyle: 'none',
      },
      li: {
        marginTop: 13,
        marginBottom: 13,
      },
      senderUsername: {
        fontWeight: 'bold',
      },
      message: { fontSize: 15 },
    }
    return (
      <div
      style={{
        ...this.props.style,
        ...styles.container,
      }}
      >
        <ScrollableFeed>
          <ul style={styles.ul}>
            {this.props.messages.map((message, index) => (
              <li key={index} style={styles.li}>
                <div>
                  <span style={styles.senderUsername}>{message.senderId}</span>{' '}
                </div>
                <p style={styles.message}>{encryptor.decrypt(message.text)}</p>
              </li>
            ))}
          </ul>
        </ScrollableFeed>
      </div>
    )
  }
}

export default MessagesList