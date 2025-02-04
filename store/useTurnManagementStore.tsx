// stores/useStaffStore.ts
import { create } from 'zustand';
import { StaffPriceType } from './usePaymentStore';
import { StaffTurn, Turn, TurnService } from '@/types/turn.types';



const TURN_SERVICES: TurnService[] = [
  {
    id: 1,
    name: 'Pedicure',
    price: 40.00,
  },
  {
    id: 2,
    name: 'Manicure',
    price: 39.00,
  },
  {
    id: 3,
    name: 'Remove Polish',
    price: 15.00,
  },
  {
    id: 4,
    name: 'Waxing',
    price: 12.00,
  },
  {
    id: 5,
    name: 'Full Set',
    price: 50.00,
  },
  {
    id: 6,
    name: 'Fill',
    price: 35.00,
  },
  {
    id: 7,
    name: 'Nail Repair',
    price: 5.00,
  },
  {
    id: 8,
    name: 'Nail Design',
    price: 10.00,
  },
  {
    id: 9,
    name: 'Nail Polish',
  },
  {
    id: 10,
    name: 'Bio Gel Full Set',
  }
  

];

const STAFF_TURNS: StaffTurn[] = [
  {
    id: 1,
    staff: {
      id: 1,
      first_name: 'JONA',
      avatar: 'https://randomuser.me/api/portraits',
      skills: [
        {
          id: 1,
          name: 'Pedicure',
          price: 40.00,
        },
        {
          id: 2,
          name: 'Manicure',
          price: 39.00,
        },
      ]
    },
    turns: [
    ],
    last_turn: null
  },
  {
    id: 2,
    staff: {
      id: 2,
      first_name: 'TRACY',
      avatar: 'https://randomuser.me/api/portraits',
      skills: TURN_SERVICES
    },
    turns: [
    ],
    last_turn: null
  },
  {
    id: 3,
    staff: {
      id: 3,
      first_name: 'LINDA',
      skills: TURN_SERVICES
    },
    turns: [],
    last_turn: null
  },
  {
    id: 4,
    staff: {
      id: 4,
      first_name: 'BRYAIN',
      skills: TURN_SERVICES
    },
    turns: [],
    last_turn: null
  },
  {
    id: 5,
    staff: {
      id: 5,
      first_name: 'LYN',
      skills: TURN_SERVICES
    },
    turns: [],
    last_turn: null
  },
  {
    id: 6,
    staff: {
      id: 6,
      first_name: 'EMMA',
      skills: TURN_SERVICES
    },
    turns: [],
    last_turn: null
  },
  {
    id: 7,
    staff: {
      id: 7,
      first_name: 'LINA *',
      skills: TURN_SERVICES
    },
    turns: [],
    last_turn: null
  },
  {
    id: 8,
    staff: {
      id: 8,
      first_name: 'MYNY',
      skills: TURN_SERVICES
    },
    turns: [],
    last_turn: null
  },
  {
    id: 9,
    staff: {
      id: 9,
      first_name: 'KY',
      skills: TURN_SERVICES
    },
    turns: [],
    last_turn: null
  }
]


export interface TurnManagementState {
  staffTurns: StaffTurn[];
  initialTurnService: TurnService[];
  setStaffTurns: (staffTurns: StaffTurn[]) => void;
  addStaffTurn: (staffTurn: StaffTurn, newTurn?: Turn) => void;
  updateStaffTurn: (staffTurns: StaffTurn, updateTurn: Turn) => void;
  removeStaffTurn: (staffTurns: StaffTurn, updateTurn: Turn) => void;
  resetStaffTurns: () => void;
  initStaffTurns: () => void;
  getSuggestionStaffTurns: () => StaffTurn[];

}


export const useTurnManagementStore = create<TurnManagementState>((set, get) => ({
  staffTurns: [],
  initialTurnService: TURN_SERVICES,
  setStaffTurns: (staffTurns) => set({ staffTurns }),
  addStaffTurn: (currentStaffTurn, newTurn) => {
    if (newTurn) {
      currentStaffTurn.turns.push(newTurn);
      currentStaffTurn.last_turn = newTurn;
    }
    let staffTurns = get().staffTurns;
    staffTurns = staffTurns.map((st) => st.id === currentStaffTurn.id ? currentStaffTurn : st);
    set({ staffTurns: staffTurns })
  },
  updateStaffTurn: (currentStaffTurn, updateStaffTurn) => {

    const newStaffTurns = currentStaffTurn.turns.map((turn) => turn.id === updateStaffTurn.id ? updateStaffTurn : turn);
    currentStaffTurn.turns = newStaffTurns;
    currentStaffTurn.last_turn = updateStaffTurn;
    let staffTurns = get().staffTurns;
    staffTurns = staffTurns.map((st) => st.id === currentStaffTurn.id ? currentStaffTurn : st);
    set({ staffTurns: staffTurns })
  },
  removeStaffTurn: (staffTurns: StaffTurn, updateTurn: Turn) => {
    staffTurns.turns = staffTurns.turns.filter((turn) => turn.id !== updateTurn.id);
    staffTurns.last_turn = staffTurns.turns.length > 0 ? staffTurns.turns[staffTurns.turns.length - 1] : null;
    let newStaffTurns = get().staffTurns.map((st) => st.id === staffTurns.id ? staffTurns : st);
    set({ staffTurns: newStaffTurns })
  },
  resetStaffTurns: () => {
    get().initStaffTurns();
  },
  initStaffTurns: () => {
    set({ staffTurns: STAFF_TURNS })
  },
  getSuggestionStaffTurns: () => {
    const staffTurns = get().staffTurns;
    console.log('suggestion turns::', JSON.stringify(staffTurns, null, 4));

    return staffTurns.filter((st) => st.turns.length === 0);
  }



}));