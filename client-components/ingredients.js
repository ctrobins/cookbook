import React from 'react';
import axios from 'axios';
import IP from '../IP.js';
import IngredientEntry from './ingredients-components/ingredientEntry.js';
import IngredientsEditor from './ingredients-components/ingredientsEditor.js';
import IngredientAdder from './ingredients-components/ingredientAdder.js';
import { styles } from '../styles';

import { Text, View, FlatList, Modal, KeyboardAvoidingView } from 'react-native';
import { Button } from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';
//==================================================== 'index' state is required for refreshing the ingredient's list; <FlatList /> is a pure component so it will not auto refresh normally
class Ingredients extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      index: 0,
      numbers: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
        16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
        31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45,
        46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60,
        61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75,
        76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90,
        91, 92, 93, 94, 95, 96, 97, 98, 99],
      units: [
        {
          name: '',
          abrv: null
        },
        {
          name: 'tablespoon',
          abrv: 'tsp',
        },
        {
          name: 'fluid ounce',
          abrv: 'fl-oz',
        },
        {
          name: 'cup',
          abrv: 'cup',
        },
        {
          name: 'pint',
          abrv: 'pnt',
        },
        {
          name: 'quart',
          abrv: 'qt',
        },
        {
          name: 'gallon',
          abrv: 'gal',
        },
        {
          name: 'ounce',
          abrv: 'oz',
        },
        {
          name: 'pound',
          abrv: 'lb',
        },
        {
          name: 'liter',
          abrv: 'l',
        }
      ],
      editMode: false,
    }
    
    this.submitIngredient = this.submitIngredient.bind(this);
    this.editMode = this.editMode.bind(this);
  }
  //==================================================== NavBar component
  static navigationOptions = {
    tabBarColor: 'deepskyblue',
    tabBarIcon: () => {
      return <Ionicons name='ios-basket' size={25} color='white' />;
    },
  }
  //====================================================
  componentDidMount() {
  }

  submitIngredient(quantity, unit, name) {
    if (name.length > 0 && quantity > 0) {
      let newIngredient = {
        email: this.props.screenProps.email,
        shouldReplace: false,
        ingredients: [
          {
            ingredient: name,
            quantity: quantity,
            unit: unit
          }
        ]
      };
      console.log(newIngredient);

      axios.post(`http://${IP}/api/ingredients`, newIngredient)
        .then((response) => {
          console.log(response.data);
          this.props.screenProps.getIngredients();
          this.setState({
            index: this.state.index + 1
          });
          this.props.screenProps.recipeListIndex++;
        })
        .catch((error) => {
          console.log(error);
        })
    } else {
      alert('Enter Valid Ingredient/Quantity')
    }
  }

  editIngredients() {
    let editedIngredients = {
      email: this.props.screenProps.email,
      shouldReplace: true,
      ingredients: []
    }

    this.props.screenProps.ingredients.forEach((item) => {
      editedIngredients.ingredients.push(
        {
          ingredient: item.ingredient,
          quantity: item.quantity,
          unit: item.unit,
        }
      )
    })
    // console.log('Edited: ', editedIngredients);
    axios.post(`http://${IP}/api/ingredients`, editedIngredients)
      .then((response) => {
        // console.log(response.data);
        this.props.screenProps.getIngredients();
        this.setState({
          index: this.state.index + 1
        });
        // this.props.screenProps.recipeListIndex++;
      })
      .catch((error) => {
        console.log(error);
      })
  }

  editMode() {
    this.setState({
      editMode: true
    })
  }

  //====================================================
  render() {
    return (
      <View style={[styles.container, { backgroundColor: 'white', }]}>
        <Text>Here are your Ingredients:</Text>
        <FlatList
          style={[styles.list, { width: 350 }]}
          data={this.props.screenProps.ingredients}
          extraData={this.state.index}
          renderItem={({ item }) => <IngredientEntry item={item} />}
          keyExtractor={(item) => item.ingredient}
        />
        <Modal
          animationType='slide'
          transparent={false}
          visible={this.state.editMode}
          onRequestClose={() => {
            console.log('Modal Closing');
            this.setState({
              editMode: false
            })
          }}>
          <View style={[styles.container, { backgroundColor: 'white', }]}>
            <Text>Editing Mode</Text>
            <FlatList
              style={[styles.list, { width: 350 }]}
              data={this.props.screenProps.ingredients}
              extraData={this.state.index}
              renderItem={({ item }) => <IngredientsEditor item={item} numbers={this.state.numbers} units={this.state.units} />}
              keyExtractor={(item) => item.ingredient}
            />
            <Button
              title='Confirm'
              onPress={() => {
                this.editIngredients();
                this.setState({
                  editMode: false,
                })
              }} />
          </View>
        </Modal>
        <KeyboardAvoidingView behavior="padding" enabled>
          <IngredientAdder
            numbers={this.state.numbers}
            units={this.state.units}
            editMode={this.editMode}
            submitIngredient={this.submitIngredient}
          />
        </KeyboardAvoidingView>
      </View>
    )
  }
}

export default Ingredients;