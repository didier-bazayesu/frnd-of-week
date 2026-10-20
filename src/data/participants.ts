import type { Participant } from '../types/participant';
import { isValidPhone } from '../utils/phone';

/** Flags incomplete records and returns the full participant list. */
function flag(p: Omit<Participant, 'incomplete' | 'incompleteReasons' | 'adminNote'> & { incomplete?: boolean; incompleteReasons?: Participant['incompleteReasons']; adminNote?: string }): Participant {
  const reasons: Participant['incompleteReasons'] = [];
  if (!p.phone) reasons.push('missing_phone');
  else if (!isValidPhone(p.phone)) reasons.push('invalid_phone');
  return reasons.length > 0
    ? { ...p, incomplete: true, incompleteReasons: reasons }
    : { ...p, incomplete: false };
}

export const participants: Participant[] = [
  flag({
    id: "p01",
    firstName: "Didier",
    lastName: "Bazayesu",
    year: "Y3",
    phone: "0790213746",
  }),
  flag({
    id: "p02",
    firstName: "MBONYINTEGE",
    lastName: "Augustin",
    year: "Y1",
    phone: "0798665228",
  }),
  flag({
    id: "p03",
    firstName: "John",
    lastName: "MANISHIMWE",
    year: "Y1",
    phone: "0728985389",
  }),
  flag({
    id: "p04",
    firstName: "BUGINGO",
    lastName: "Flexon",
    year: "Y2",
    phone: "+250794560818",
  }),
  flag({
    id: "p05",
    firstName: "Claude",
    lastName: "Daddy",
    year: "Y3",
    phone: "0782768787",
  }),
  flag({
    id: "p06",
    firstName: "IMANZIYASE IGABA",
    lastName: "Festo",
    year: "Y3",
    phone: "0781073712",
  }),
  flag({
    id: "p07",
    firstName: "Munezero",
    lastName: "Kenia",
    year: "Y3",
    phone: "0795148857",
  }),
  flag({
    id: "p08",
    firstName: "Ishimwe",
    lastName: "Delphin",
    year: "Y3",
    phone: "0790336869",
  }),
  flag({
    id: "p09",
    firstName: "Ishimwe",
    lastName: "Chretien",
    year: "Y1",
    phone: "0793889543",
  }),
  flag({
    id: "p10",
    firstName: "DUSHIMIMANA",
    lastName: "Destin",
    year: "Y1",
    phone: "0794439771",
  }),
  flag({
    id: "p11",
    firstName: "Uwikunze",
    lastName: "Belve",
    year: "Y3",
    phone: "0792041700",
  }),
  flag({
    id: "p12",
    firstName: "mutuyimana",
    lastName: "ange",
    year: "Y3",
    phone: "0792454072",
  }),
  flag({
    id: "p13",
    firstName: "Iyabivuze",
    lastName: "Gloria",
    year: "Y2",
    phone: "0792382035",
  }),
  flag({
    id: "p14",
    firstName: "Hoziana",
    lastName: "Hodard",
    year: "Y2",
    phone: "0726622280",
  }),
  flag({
    id: "p15",
    firstName: "Mukandayisabye",
    lastName: "Sandrine",
    year: "Y1",
    phone: "0795704662",
  }),
  flag({
    id: "p16",
    firstName: "ROBERT",
    lastName: "NIYONKURU",
    year: "Y3",
    phone: "0795064502",
  }),
  flag({
    id: "p17",
    firstName: "Siborourema",
    lastName: "Paul",
    year: "Y3",
    phone: "0781627602",
  }),
  // p18: phone '782886952' is 9 digits — likely missing a leading '0'. Flagged for admin review.
  flag({
    id: "p18",
    firstName: "Ishimwe",
    lastName: "Modesta",
    year: "Y3",
    phone: "0782886952",
    adminNote:
      "Phone number '782886952' has only 9 digits. A leading '0' may be missing. Please verify and correct.",
  } as Participant),
  flag({
    id: "p19",
    firstName: "MANIRANEJEJE",
    lastName: "Josue",
    year: "Y3",
    phone: "0780026662",
  }),
  flag({
    id: "p20",
    firstName: "MASENGESHO",
    lastName: "Daniel",
    year: "Y2",
    phone: "+250794493855",
  }),
  flag({
    id: "p21",
    firstName: "Elina",
    lastName: "MURAGIJIMANA",
    year: "Y2",
    phone: "0794263703",
  }),
  flag({
    id: "p22",
    firstName: "MBABAZI",
    lastName: "Renatha",
    year: "Y3",
    phone: "0783273379",
  }),
  flag({
    id: "p23",
    firstName: "SHYIRAMBERE",
    lastName: "Moise",
    year: "Y3",
    phone: "0790235415",
  }),
  flag({
    id: "p24",
    firstName: "Muhoza",
    lastName: "Jean Claude",
    year: "Y3",
    phone: "0784606702",
  }),
  flag({
    id: "p25",
    firstName: "Nadine",
    lastName: "Imanishimwe",
    year: "Btech",
    phone: "0788749393",
  }),
  flag({
    id: "p26",
    firstName: "Nkurunziza",
    lastName: "Getmain",
    year: "Y2",
    phone: "0791406391",
  }),
  flag({
    id: "p27",
    firstName: "Cyiza",
    lastName: "Mbonyi Claudine",
    year: "Y2",
    phone: "0792583913",
  }),
  flag({
    id: "p28",
    firstName: "Giselle",
    lastName: "Komezusenge",
    year: "Y1",
    phone: "0796947439",
  }),
  flag({
    id: "p29",
    firstName: "Sammuel",
    lastName: "Nemeyimana",
    year: "Y1",
    phone: "0798796364",
  }),
  flag({
    id: "p30",
    firstName: "MUGISHA",
    lastName: "Daniel",
    year: "Y2",
    phone: "0795431609",
  }),
  flag({
    id: "p31",
    firstName: "TUYIZERE",
    lastName: "Gilbert",
    year: "Y3",
    phone: "0791908767",
  }),
  flag({
    id: "p32",
    firstName: "Yvonne",
    lastName: "Nyiramahirwe",
    year: "Y3",
    phone: "0790195036",
  }),
  flag({
    id: "p34",
    firstName: "Uwimana",
    lastName: "Solange",
    year: "Y2",
    phone: "0796674416",
  }),
  // p33: phone is missing. Flagged for admin review.
  flag({
    id: "p33",
    firstName: "Uwingabiye",
    lastName: "Delphine",
    year: "Y3",
    phone: "0798644099",
  } as Participant),
];
