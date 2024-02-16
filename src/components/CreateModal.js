import React from 'react';

import {Modal, StyleSheet, View} from 'react-native';

const CreateModal = props => {
  return (
    <Modal
      animationType={'fade'}
      transparent={true}
      visible={props.modalVisible}>
      <View style={styles.container}>
        <View
          style={styles.blankSpace}
          onTouchEnd={() => props.setModalVisible(false)} // 모달 빈 공간을 누르면 창 닫기
        />

        {props.body}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

    justifyContent: 'center',

    alignItems: 'center',
  },

  blankSpace: {
    position: 'absolute',

    width: '100%',

    height: '100%',

    backgroundColor: '#000000',

    opacity: 0.4,
  },
});

export default CreateModal;
