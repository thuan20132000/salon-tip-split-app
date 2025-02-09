// stores/useStaffStore.ts
import { create } from 'zustand';
import { StaffPriceType } from './usePaymentStore';
import { StaffTurn, Turn, TurnService } from '@/types/turn.types';
import { salonAPI } from '@/api/salonAPI';
import { useSalonStore } from './useSalonStore';
import { SalonServiceType, StaffTurnServiceFilterType } from '@/types/salon.types';
import useSalonServicesStore from './useSalonServicesStore';
import dayjs from 'dayjs';
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

const INITIAL_STAFF_TURNS: StaffTurn[] = [
  {
    id: 1,
    staff: {
      id: 1,
      first_name: 'JONA',
      avatar: 'https://randomuser.me/api/portraits',
      skills: []
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
      skills: []
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
      skills: []
    },
    turns: [],
    last_turn: null
  },
  {
    id: 4,
    staff: {
      id: 4,
      first_name: 'BRYAIN',
      skills: []
    },
    turns: [],
    last_turn: null
  },
  {
    id: 5,
    staff: {
      id: 5,
      first_name: 'LYN',
      skills: []
    },
    turns: [],
    last_turn: null
  },
  // {
  //   id: 6,
  //   staff: {
  //     id: 6,
  //     first_name: 'EMMA',
  //     skills: TURN_SERVICES
  //   },
  //   turns: [],
  //   last_turn: null
  // },
  // {
  //   id: 7,
  //   staff: {
  //     id: 7,
  //     first_name: 'LINA *',
  //     skills: TURN_SERVICES
  //   },
  //   turns: [],
  //   last_turn: null
  // },
  // {
  //   id: 8,
  //   staff: {
  //     id: 8,
  //     first_name: 'MYNY',
  //     skills: TURN_SERVICES
  //   },
  //   turns: [],
  //   last_turn: null
  // },
  // {
  //   id: 9,
  //   staff: {
  //     id: 9,
  //     first_name: 'KY',
  //     skills: TURN_SERVICES
  //   },
  //   turns: [],
  //   last_turn: null
  // }
]

const getInitialStaffTurns = () => {
  return INITIAL_STAFF_TURNS.map(staffTurn => ({
    ...staffTurn,
    turns: [],
    last_turn: null,
    staff: {
      ...staffTurn.staff,
    }
  }));
};

export interface TurnManagementState {
  staffTurns: StaffTurn[];
  salonTurnServices: SalonServiceType[];
  setStaffTurns: (staffTurns: StaffTurn[]) => void;
  addStaffTurn: (staffTurn: StaffTurn, newTurn?: Turn) => void;
  updateStaffTurn: (staffTurns: StaffTurn, updateTurn: Turn) => void;
  removeStaffTurn: (staffTurns: StaffTurn, updateTurn: Turn) => void;
  resetStaffTurns: () => void;
  initStaffTurns: () => void;
  getSuggestionStaffTurns: () => void;
  initStaffServiceSkills: () => Promise<void>;

}


export const useTurnManagementStore = create<TurnManagementState>((set, get) => ({
  staffTurns: [],
  salonTurnServices: [],
  setStaffTurns: (staffTurns) => set({ staffTurns }),
  addStaffTurn: (currentStaffTurn, newTurn) => {
    if (newTurn) {
      currentStaffTurn.turns.push(newTurn);
      currentStaffTurn.last_turn = newTurn;
    }
    let staffTurns = [...get().staffTurns]
    
    staffTurns = staffTurns.map((st) => st.staff?.id === currentStaffTurn.staff?.id ? currentStaffTurn : st);
    set({ staffTurns: staffTurns })
  },
  updateStaffTurn: (currentStaffTurn, updateStaffTurn) => {

    const newStaffTurns = currentStaffTurn.turns.map((turn) => turn.id === updateStaffTurn.id ? updateStaffTurn : turn);
    currentStaffTurn.turns = newStaffTurns;
    currentStaffTurn.last_turn = updateStaffTurn;
    let staffTurns = get().staffTurns;
    staffTurns = staffTurns.map((st) => st.staff?.id === currentStaffTurn.staff?.id ? currentStaffTurn : st);
    set({ staffTurns: staffTurns })
  },
  removeStaffTurn: (staffTurns: StaffTurn, updateTurn: Turn) => {
    staffTurns.turns = staffTurns.turns.filter((turn) => turn.id !== updateTurn.id);
    staffTurns.last_turn = staffTurns.turns.length > 0 ? staffTurns.turns[staffTurns.turns.length - 1] : null;
    let newStaffTurns = get().staffTurns.map((st) => st.staff?.id === staffTurns.staff?.id ? staffTurns : st);
    set({ staffTurns: newStaffTurns })
  },
  resetStaffTurns: () => {
    // let staffTurns = [...INITIAL_STAFF_TURNS];



    set({ staffTurns: getInitialStaffTurns() })
  },
  initStaffTurns: () => {
    set({ staffTurns: getInitialStaffTurns() })
  },

  getSuggestionStaffTurns: () => {
  },

  initStaffServiceSkills: async () => {
    
    const { salonServices} = useSalonServicesStore.getState();

    try {
      const selectedSalon = useSalonStore.getState().selectedSalon;
      if (!selectedSalon) {
        throw new Error('Salon not found');
      }
      const filter: StaffTurnServiceFilterType = {
        salon_id: selectedSalon.id
      }
      const response = await salonAPI.getStaffTurnServices(selectedSalon.id, filter);
      
      const staffTurnServices = response.data.data;
      const staffTurnServicesWithSkills = staffTurnServices.map((st) => {
        return {
          ...st,
          last_turn: {
            ...st.last_turn,
            created_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            updated_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
          }
        }
      })
      

      set({ staffTurns: staffTurnServicesWithSkills, salonTurnServices: salonServices })


    } catch (error) {

    }

  }



}));