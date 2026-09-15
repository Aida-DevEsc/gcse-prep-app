"""OCR GCSE Computer Science (J277) content. Run: python scripts/content/gen_computerscience.py"""
import os
from common import q, topic, write_subject

P1 = 'cs-systems'
P2 = 'cs-programming'

architecture = topic(
    'cs-architecture', P1, '1.1 Systems Architecture',
    'The CPU, von Neumann architecture, registers, the fetch-execute cycle, performance and embedded systems.',
    """
As your OCR tutor: this is spec section 1.1, examined on Paper 1 (J277/01). Examiners love asking you to name a register AND say what it does, so learn them as pairs.

**Purpose of the CPU.** The CPU processes data and instructions by repeatedly carrying out the fetch-execute cycle. In the von Neumann architecture, program instructions and data are stored together in the same main memory, and the CPU fetches both from there.

**Components.** The ALU (Arithmetic Logic Unit) carries out calculations and logical comparisons. The CU (Control Unit) decodes instructions and sends control signals that coordinate the flow of data around the CPU. Cache is a small amount of very fast memory inside the CPU that stores frequently used data and instructions, so they don't have to be fetched from slower RAM.

**Registers (tiny, super-fast storage inside the CPU).** The Program Counter (PC) holds the address of the next instruction to be fetched. The MAR (Memory Address Register) holds the address in memory that is about to be read from or written to. The MDR (Memory Data Register) holds the data or instruction that has just been fetched from memory, or is about to be written to it. The Accumulator (ACC) holds the result of calculations done by the ALU.

**The fetch-execute cycle.** Fetch: the address in the PC is copied to the MAR; the PC is incremented; the instruction at that address is fetched into the MDR. Decode: the CU decodes the instruction. Execute: the instruction is carried out — e.g. the ALU does a calculation and the result goes in the accumulator. Then the cycle repeats.

**Performance.** Clock speed (GHz) is the number of fetch-execute cycles per second — 3 GHz is 3 billion. More cache means fewer slow trips to RAM. More cores means more instructions can be processed at the same time — but only if the software is written to split its work between cores, so doubling the cores rarely doubles the speed.

**Embedded systems** are computers built into a larger device to do one dedicated job — a washing machine controller, a car's engine management, a microwave. They are usually small, cheap, low-power and very reliable.
""",
    ['CPU carries out the fetch-execute cycle; von Neumann stores instructions and data in the same memory',
     'ALU = calculations and logic; CU = decodes instructions and coordinates data flow; cache = fast memory inside the CPU',
     'PC = address of next instruction; MAR = address being accessed; MDR = data fetched or to be written; ACC = results',
     'Fetch: PC → MAR, PC incremented, instruction → MDR; then decode (CU) and execute',
     'Performance: clock speed, cache size, number of cores (cores only help if software uses them)',
     'Embedded system: computer inside a larger device with one dedicated function'],
    [('What does the Program Counter hold?', 'The address of the next instruction to be fetched.'),
     ('MAR vs MDR?', 'MAR holds the memory ADDRESS being accessed; MDR holds the DATA/instruction fetched from or written to that address.'),
     ('Why does doubling the cores not always double the speed?', 'Software must be written to split tasks between cores, and some tasks depend on each other so cannot run in parallel.'),
     ('Give two features of an embedded system.', 'Dedicated to one task, built into a larger device — typically small, low power, cheap and reliable.'),
     ('What is the von Neumann architecture?', 'A design where program instructions and data are stored together in the same main memory.')],
    [
        q('cs-arch-q1', 'What is the purpose of the CPU?', ['To store files permanently', 'To fetch, decode and execute instructions', 'To display images on the screen', 'To connect the computer to a network'], 'To fetch, decode and execute instructions', 'The CPU processes data and instructions by repeatedly carrying out the fetch-decode-execute cycle.', 'foundation'),
        q('cs-arch-q2', 'Which register holds the address of the next instruction to be fetched?', ['MDR', 'Accumulator', 'Program Counter (PC)', 'MAR'], 'Program Counter (PC)', 'The PC holds the address of the next instruction. It is incremented during each fetch.', 'foundation'),
        q('cs-arch-q3', 'Which register stores the results of calculations carried out by the ALU?', ['Accumulator (ACC)', 'Program Counter', 'MAR', 'MDR'], 'Accumulator (ACC)', 'The accumulator holds the results of calculations performed by the ALU.', 'intermediate'),
        q('cs-arch-q4', 'What is held in the MDR?', ['The address of the next instruction', 'The clock speed of the CPU', 'Only the result of the last calculation', 'The data or instruction fetched from memory, or about to be written to it'], 'The data or instruction fetched from memory, or about to be written to it', 'The Memory Data Register holds whatever is being transferred to or from memory.', 'intermediate'),
        q('cs-arch-q5', 'Which component decodes instructions and coordinates the flow of data around the CPU?', ['ALU', 'Cache', 'Control Unit', 'Accumulator'], 'Control Unit', 'The CU decodes each instruction and sends control signals to coordinate the other components.', 'intermediate'),
        q('cs-arch-q6', 'Which of these happens during the FETCH stage of the cycle?', ['The ALU performs a calculation', 'The Program Counter is incremented', 'The CU decodes the instruction', 'The result is stored in the accumulator'], 'The Program Counter is incremented', 'In the fetch stage the PC address goes to the MAR, the PC is incremented, and the instruction is copied into the MDR. Decoding and executing come afterwards.', 'higher'),
        q('cs-arch-q7', "A phone's CPU is upgraded from 2 to 4 cores, but one app runs no faster. What is the most likely reason?", ['The app is not written to split its work across multiple cores', 'Extra cores reduce the clock speed to zero', 'Cores only affect storage capacity', 'Adding cores removes the cache'], 'The app is not written to split its work across multiple cores', 'Extra cores only help when a program can divide its work into tasks that run in parallel.', 'higher'),
        q('cs-arch-q8', 'Why does a larger cache usually improve CPU performance?', ['Cache is slower than RAM, so it forces the CPU to wait', 'Cache stores files permanently when the power is off', 'Cache increases the clock speed', 'More frequently used data and instructions can be kept in fast memory close to the CPU, reducing slower RAM accesses'], 'More frequently used data and instructions can be kept in fast memory close to the CPU, reducing slower RAM accesses', 'Cache is much faster than RAM. The more that fits in cache, the less often the CPU has to wait for RAM.', 'higher'),
        q('cs-arch-q9', 'What is the defining feature of the von Neumann architecture?', ['Separate memories for instructions and data', 'Instructions and data are stored together in the same memory', 'It has no registers', 'It can only run one program ever'], 'Instructions and data are stored together in the same memory', 'Von Neumann machines store both program instructions and data in a single shared main memory.', 'further'),
        q('cs-arch-q10', 'A CPU runs at 3.2 GHz. How many clock cycles does it perform each second?', ['3.2 thousand', '3.2 million', '32 billion', '3.2 billion'], '3.2 billion', 'Giga means billion (10^9), so 3.2 GHz is 3.2 billion cycles per second.', 'further'),
        q('cs-arch-q11', 'Which is the best example of an embedded system?', ['A laptop running office software', 'A web server hosting many websites', 'The controller inside a washing machine', 'A desktop PC used for gaming'], 'The controller inside a washing machine', 'An embedded system is a computer built into a larger device to perform one dedicated function, like controlling a wash cycle.', 'further'),
    ])

memory = topic(
    'cs-memory', P1, '1.2a Memory and Storage',
    'RAM, ROM, virtual memory, secondary storage types and units of data.',
    """
As your OCR tutor: this is spec section 1.2 on Paper 1. Storage questions nearly always give you a scenario ("a photographer needs…") — pick the storage type AND justify it using characteristics: capacity, speed, portability, durability, reliability and cost.

**Primary storage.** RAM is volatile (loses its contents when power is off) and holds the programs and data currently in use; it can be read from and written to. ROM is non-volatile and read-only; it stores the boot-up (bootstrap/BIOS) instructions the computer needs when it is switched on.

**Virtual memory.** When RAM is full, part of secondary storage is used as if it were RAM. Data not currently needed is moved out to secondary storage and swapped back in when needed. Because secondary storage is far slower than RAM, heavy use of virtual memory makes the computer slow down. The fix is more RAM.

**Why secondary storage?** RAM is volatile and relatively small, so we need non-volatile storage to keep files and programs permanently.

**Types.** Magnetic (hard disk drives): very high capacity, low cost per GB, but moving parts make them slower and less durable. Solid state (SSDs, USB sticks, SD cards): fast, no moving parts so durable and silent, low power, but more expensive per GB. Optical (CD/DVD/Blu-ray): cheap and portable but low capacity, slow, and easily scratched.

**Units.** bit (a 0 or 1) → nibble (4 bits) → byte (8 bits) → kilobyte → megabyte → gigabyte → terabyte → petabyte. OCR accepts either 1,000 or 1,024 as the multiplier — use 1,000 unless the question says otherwise, and always show your working.
""",
    ['RAM: volatile, read/write, holds programs and data in use', 'ROM: non-volatile, read-only, holds boot-up instructions',
     'Virtual memory: secondary storage used as extra RAM when RAM is full — slow; fix with more RAM',
     'Magnetic = high capacity, cheap per GB, moving parts; solid state = fast, durable, pricier; optical = cheap, portable, low capacity',
     'Justify storage choices with capacity, speed, portability, durability, reliability, cost',
     'bit < nibble (4 bits) < byte (8 bits) < KB < MB < GB < TB < PB'],
    [('Why is ROM needed?', 'It is non-volatile, so it keeps the boot-up instructions when the power is off.'),
     ('When is virtual memory used?', 'When RAM is full — part of secondary storage acts as extra (much slower) memory.'),
     ('Two advantages of SSDs over HDDs?', 'Faster access, and no moving parts so more durable (also lighter, quieter, lower power).'),
     ('How many bits in a nibble and in a byte?', '4 bits in a nibble, 8 bits in a byte.')],
    [
        q('cs-mem-q1', 'Which type of memory is volatile?', ['ROM', 'Hard disk drive', 'RAM', 'Optical disc'], 'RAM', 'RAM loses its contents when the power is switched off.', 'foundation'),
        q('cs-mem-q2', 'How many bits are there in a nibble?', ['2', '4', '8', '16'], '4', 'A nibble is 4 bits — half a byte.', 'foundation'),
        q('cs-mem-q3', 'What does ROM typically store?', ['The boot-up (bootstrap) instructions needed to start the computer', 'The document the user is currently editing', 'Web pages being downloaded', 'Virtual memory'], 'The boot-up (bootstrap) instructions needed to start the computer', 'ROM is non-volatile and read-only, so it is used for the start-up instructions.', 'intermediate'),
        q('cs-mem-q4', 'Why do computers need secondary storage?', ['Because RAM is non-volatile', 'To speed up the clock', 'To store data and programs permanently when the power is off', 'To replace the CPU'], 'To store data and programs permanently when the power is off', 'RAM is volatile and limited in size, so non-volatile secondary storage keeps files permanently.', 'intermediate'),
        q('cs-mem-q5', 'A computer with many programs open becomes very slow. Which explanation is best?', ['ROM is full', 'The CPU has too much cache', 'RAM is full, so slower virtual memory on secondary storage is being used', 'The monitor resolution is too high'], 'RAM is full, so slower virtual memory on secondary storage is being used', 'Swapping data between RAM and much slower secondary storage causes the slowdown.', 'higher'),
        q('cs-mem-q6', 'A photographer needs to store 8 TB of images on a desktop as cheaply as possible. Which storage is most suitable?', ['Magnetic hard disk drive', 'Solid state drive', 'Blu-ray discs', 'ROM'], 'Magnetic hard disk drive', 'HDDs offer very high capacity at the lowest cost per GB, and portability/durability matter less for a desktop.', 'higher'),
        q('cs-mem-q7', 'Why are solid state drives used in most modern laptops and phones?', ['They are volatile', 'They are fast, durable with no moving parts, light and use little power', 'They are the cheapest storage per GB', 'They have moving parts that make them faster'], 'They are fast, durable with no moving parts, light and use little power', 'Portable devices get knocked about and run on batteries, so SSDs are the best fit.', 'higher'),
        q('cs-mem-q8', 'How many 4 MB photos fit on a 2 GB memory card (1 GB = 1,000 MB)?', ['50', '500', '5,000', '8,000'], '500', '2 GB = 2,000 MB; 2,000 ÷ 4 = 500 photos.', 'further'),
        q('cs-mem-q9', "What is the best way to reduce a computer's reliance on virtual memory?", ['Add more ROM', 'Use a larger monitor', 'Add more optical drives', 'Add more RAM'], 'Add more RAM', 'More RAM means data is less likely to be swapped out to slow secondary storage.', 'further'),
        q('cs-mem-q10', 'Which list is in order from smallest to largest?', ['byte, bit, nibble, kilobyte, gigabyte, megabyte', 'bit, byte, nibble, megabyte, kilobyte, terabyte', 'bit, nibble, byte, kilobyte, megabyte, gigabyte, terabyte, petabyte', 'nibble, bit, byte, gigabyte, megabyte, petabyte'], 'bit, nibble, byte, kilobyte, megabyte, gigabyte, terabyte, petabyte', 'Each step up is 1,000 (or 1,024) times bigger after the byte.', 'intermediate'),
    ])

datarep = topic(
    'cs-data-rep', P1, '1.2b Data Representation',
    'Binary, denary and hexadecimal, binary addition and shifts, characters, images, sound and compression.',
    """
As your OCR tutor: data representation is part of spec 1.2 on Paper 1 and is full of calculation marks — show your working, because method marks are available even if the final answer slips.

**Why binary?** Computers are built from billions of transistors (switches) with two states, on and off, which map to 1 and 0.

**Conversions.** 8-bit binary place values are 128, 64, 32, 16, 8, 4, 2, 1, so an 8-bit number holds 0–255. Hexadecimal is base 16 (0–9 then A=10 … F=15). Each hex digit represents exactly 4 bits (a nibble), so to convert binary to hex, split into nibbles: 1101 0110 = D6. Hex is used because it is shorter and easier for humans to read than binary.

**Binary addition and overflow.** Add column by column: 1+1 = 0 carry 1; 1+1+1 = 1 carry 1. If the result needs more bits than are available (e.g. more than 255 in 8 bits), an overflow error occurs.

**Binary shifts.** A left shift of n places multiplies by 2ⁿ; a right shift of n places divides by 2ⁿ (bits shifted off the end are lost, which can lose precision).

**Characters.** A character set maps each character to a binary code. ASCII uses 7 bits (128 characters, enough for English). Unicode uses more bits per character, so it can represent many more characters — every major alphabet, plus symbols and emoji.

**Images.** Bitmaps are made of pixels. Colour depth = bits per pixel; resolution = number of pixels. File size (bits) = width × height × colour depth. Metadata (width, height, colour depth) is stored with the image. More colour depth or resolution = better quality but bigger files.

**Sound.** Analogue sound is sampled at regular intervals. Sample rate (Hz) = samples per second; bit depth = bits per sample. File size (bits) = sample rate × bit depth × duration (s). Higher rate/depth = closer to the original but bigger files.

**Compression.** Lossy compression permanently removes data (e.g. JPEG, MP3) — much smaller files, some quality loss. Lossless compression lets the original be rebuilt exactly (e.g. PNG, ZIP) — essential for text and program files.
""",
    ['8-bit binary holds 0–255 (place values 128…1); each hex digit = one nibble (4 bits)',
     'Overflow: result needs more bits than are available', 'Left shift n = ×2ⁿ; right shift n = ÷2ⁿ',
     'ASCII 7-bit (128 characters); Unicode uses more bits to cover every language and emoji',
     'Image size = width × height × colour depth (bits); sound size = sample rate × bit depth × seconds',
     'Lossy removes data permanently; lossless can be fully restored (needed for text/code)'],
    [('Why use hex instead of binary?', 'It is shorter and easier for people to read and less error-prone to write; each hex digit is one nibble.'),
     ('What does a left shift of 3 do?', 'Multiplies the number by 2³ = 8.'),
     ('Image file size formula?', 'Width × height × colour depth (in bits). Divide by 8 for bytes.'),
     ('Why must program files use lossless compression?', 'Every character must be restored exactly or the program will not work.')],
    [
        q('cs-dr-q1', 'Convert denary 13 into 8-bit binary.', ['00001011', '00001101', '00010011', '00001110'], '00001101', '13 = 8 + 4 + 1, so the 8, 4 and 1 columns are set: 00001101.', 'foundation'),
        q('cs-dr-q2', 'What is binary 1010 in denary?', ['8', '12', '10', '5'], '10', '8 + 2 = 10.', 'foundation'),
        q('cs-dr-q3', 'Convert hexadecimal 3F into denary.', ['36', '48', '315', '63'], '63', '3 × 16 = 48, F = 15; 48 + 15 = 63.', 'intermediate'),
        q('cs-dr-q4', 'Convert binary 11010110 into hexadecimal.', ['D6', 'C6', 'D5', 'B6'], 'D6', 'Split into nibbles: 1101 = 13 = D and 0110 = 6, giving D6.', 'intermediate'),
        q('cs-dr-q5', 'Increasing the colour depth of an image will:', ['Reduce the number of colours available', 'Increase the number of possible colours per pixel and increase the file size', 'Reduce the resolution', 'Remove the metadata'], 'Increase the number of possible colours per pixel and increase the file size', 'More bits per pixel means more possible colours, but every pixel now takes more storage.', 'intermediate'),
        q('cs-dr-q6', 'What is the result of a 2-place left shift on 00010110 (denary 22)?', ['00000101 (5)', '00101100 (44)', '01011000 (88)', '10110000 (176)'], '01011000 (88)', 'A 2-place left shift multiplies by 4: 22 × 4 = 88 = 01011000.', 'higher'),
        q('cs-dr-q7', 'Adding 11001000 and 01000000 using 8 bits causes what?', ['A syntax error', 'Nothing unusual', 'A rounding error', 'Overflow — the result (264) needs 9 bits'], 'Overflow — the result (264) needs 9 bits', '200 + 64 = 264, which is greater than 255, the largest 8-bit value.', 'higher'),
        q('cs-dr-q8', 'Why does Unicode use more bits per character than ASCII?', ['To represent far more characters, including other alphabets and emoji', 'To make text load faster', 'Because ASCII cannot store numbers', 'To compress text'], 'To represent far more characters, including other alphabets and emoji', 'More bits give far more unique codes, so Unicode can cover every writing system.', 'higher'),
        q('cs-dr-q9', 'An image is 100 × 50 pixels with a colour depth of 8 bits. What is its size in bytes (ignoring metadata)?', ['40,000 bytes', '5,000 bytes', '500 bytes', '400 bytes'], '5,000 bytes', '100 × 50 × 8 = 40,000 bits; ÷ 8 = 5,000 bytes.', 'further'),
        q('cs-dr-q10', 'A 10-second clip is sampled at 44,100 Hz with a bit depth of 16. What is its size in bits?', ['441,000', '705,600', '70,560', '7,056,000'], '7,056,000', '44,100 × 16 × 10 = 7,056,000 bits.', 'further'),
        q('cs-dr-q11', "Which compression should be used for a program's source code, and why?", ['Lossy — it gives the smallest file', 'Lossy — code does not need every character', 'Lossless — the original must be restored exactly or the code will not work', 'None — text cannot be compressed'], 'Lossless — the original must be restored exactly or the code will not work', 'Losing even one character could stop the program working, so only lossless is acceptable.', 'further'),
    ])

networks = topic(
    'cs-networks', P1, '1.3 Networks, Connections and Protocols',
    'LANs and WANs, performance, client-server and peer-to-peer, hardware, the internet, topologies, addressing and protocols.',
    """
As your OCR tutor: spec section 1.3 on Paper 1. The protocols are easy marks if you learn each one with exactly what it does.

**LAN vs WAN.** A LAN covers a small geographical area (one site) and its infrastructure is usually owned by the organisation. A WAN covers a large area and connects LANs using third-party infrastructure (e.g. leased telecoms lines). The internet is the biggest WAN.

**Performance factors.** Bandwidth, number of users, transmission media (wired is faster and more reliable than wireless), interference and distance.

**Client-server vs peer-to-peer.** In client-server, a central server provides services (files, logins, backups, security) to clients — easy to manage centrally, but the server costs money and is a single point of failure. In peer-to-peer, all devices are equal and share directly — cheap and simple, but harder to back up and secure.

**Hardware.** A switch connects devices on a LAN and sends data only to the intended device (using its MAC address). A router forwards packets between networks — e.g. connecting a LAN to the internet. A WAP lets wireless devices join a wired network. A NIC connects a device to a network. Media: copper (Ethernet) cable, fibre optic, and wireless.

**The internet.** A worldwide network of networks. DNS translates domain names (e.g. purbeck.dorset.sch.uk) into IP addresses. Hosting stores websites on servers; the cloud provides storage and services on remote servers accessed over the internet.

**Topologies.** Star: every device connects to a central switch — one cable failing affects only that device, but if the switch fails the whole network goes down. Mesh: devices connect to many others, so data can be rerouted round failures — very robust but a full mesh needs lots of cabling.

**Wired and wireless.** Ethernet is fast and reliable; Wi-Fi gives mobility but can suffer interference; Bluetooth is short-range. Wireless traffic should be encrypted.

**Addressing.** IP addresses identify devices on a network (IPv4 is 32-bit, IPv6 128-bit) and can change. MAC addresses are unique 48-bit hardware addresses assigned to a NIC and normally never change.

**Protocols.** TCP/IP (TCP splits data into packets, numbers them and checks they arrive; IP routes packets between networks), HTTP (web pages), HTTPS (encrypted web pages), FTP (file transfer), SMTP (sending email), POP (retrieving email — usually downloads and deletes from the server), IMAP (retrieving email — keeps it on the server so devices stay in sync).

**Layers.** Protocols are grouped into layers; each layer handles one part of communication and only talks to the layers next to it, so a layer can be changed without affecting the others and problems are easier to isolate.
""",
    ['LAN: small area, own infrastructure; WAN: large area, third-party infrastructure (internet = biggest WAN)',
     'Switch: sends data to the right device on a LAN; router: forwards packets between networks',
     'DNS turns domain names into IP addresses', 'Star: central switch is a single point of failure; mesh: data rerouted, robust but costly',
     'MAC address fixed to the NIC; IP address can change', 'TCP/IP, HTTP, HTTPS, FTP, SMTP (send), POP, IMAP (keep in sync)'],
    [('What does a router do?', 'Forwards data packets between networks, e.g. from a home LAN to the internet.'),
     ('POP vs IMAP?', 'POP usually downloads and removes mail from the server; IMAP keeps mail on the server so all devices stay in sync.'),
     ('Why are protocols organised in layers?', 'Each layer does one job and can be changed independently, which makes development and troubleshooting easier.'),
     ('One advantage and one disadvantage of client-server?', 'Central management of security/backups; but the server is costly and a single point of failure.')],
    [
        q('cs-net-q1', 'Which device connects a LAN to the internet by forwarding packets between networks?', ['Switch', 'NIC', 'Router', 'WAP'], 'Router', 'Routers forward data packets between different networks.', 'foundation'),
        q('cs-net-q2', 'What does DNS do?', ['Encrypts web pages', 'Translates domain names into IP addresses', 'Sends email', 'Assigns MAC addresses'], 'Translates domain names into IP addresses', 'DNS lets you type a name instead of remembering the numeric IP address.', 'foundation'),
        q('cs-net-q3', 'Which protocol is used to SEND email?', ['SMTP', 'POP', 'IMAP', 'FTP'], 'SMTP', 'SMTP sends email; POP and IMAP retrieve it.', 'intermediate'),
        q('cs-net-q4', 'What is a key difference between a LAN and a WAN?', ['A WAN is always wireless', 'A LAN always uses fibre optic cable', 'There is no real difference', 'A LAN covers a small area using infrastructure the organisation owns; a WAN covers a large area using third-party infrastructure'], 'A LAN covers a small area using infrastructure the organisation owns; a WAN covers a large area using third-party infrastructure', 'Ownership of infrastructure and geographical size are the two key distinctions OCR looks for.', 'intermediate'),
        q('cs-net-q5', 'Which change would NOT reduce network performance?', ['Many users streaming video at once', 'Interference on a wireless link', 'Switching from wireless to a wired Ethernet connection', 'Low bandwidth'], 'Switching from wireless to a wired Ethernet connection', 'Wired connections are generally faster and more reliable, so this would improve performance.', 'intermediate'),
        q('cs-net-q6', 'In a star topology, what happens if the central switch fails?', ['Only one device is affected', 'The whole network stops working', 'Data is rerouted automatically', 'Nothing — star networks have no central device'], 'The whole network stops working', 'Every device connects through the switch, so it is a single point of failure.', 'higher'),
        q('cs-net-q7', 'Why are network protocols organised into layers?', ['Each layer handles one part of communication, so layers can be developed and changed independently and faults are easier to find', 'To make networks slower but safer', 'So only one protocol can run at a time', 'Because the law requires it'], 'Each layer handles one part of communication, so layers can be developed and changed independently and faults are easier to find', 'Layering breaks a complex job into manageable, self-contained parts.', 'higher'),
        q('cs-net-q8', 'A student reads email on a phone and a laptop and wants both to stay in sync. Which protocol suits this?', ['POP', 'SMTP', 'FTP', 'IMAP'], 'IMAP', 'IMAP keeps messages on the server, so every device sees the same inbox.', 'higher'),
        q('cs-net-q9', 'Which statement about MAC and IP addresses is correct?', ['Both change every time you connect', 'A MAC address is assigned to the network interface card and normally does not change; an IP address can change depending on the network', 'An IP address is permanently built into the NIC', 'MAC addresses are used to route data across the internet between networks'], 'A MAC address is assigned to the network interface card and normally does not change; an IP address can change depending on the network', 'MAC = fixed hardware identity; IP = logical address that depends on which network you are on.', 'further'),
        q('cs-net-q10', 'What is the role of TCP in the TCP/IP stack?', ['Routing packets between networks', 'Translating domain names', 'Splitting data into numbered packets, checking they all arrive and requesting re-sends so the data can be reassembled', 'Encrypting web pages'], 'Splitting data into numbered packets, checking they all arrive and requesting re-sends so the data can be reassembled', 'TCP handles reliable delivery; IP handles addressing and routing.', 'further'),
        q('cs-net-q11', 'What is the best reason for a school to choose client-server rather than peer-to-peer?', ['It needs no server so it is cheaper', 'It has no single point of failure', 'Every device must keep its own backups', 'Files, security, updates and backups can be managed centrally'], 'Files, security, updates and backups can be managed centrally', 'Central management is the key advantage for an organisation with many users.', 'further'),
    ])

security = topic(
    'cs-security', P1, '1.4 Network Security',
    'Threats (malware, social engineering, brute force, DoS, interception, SQL injection) and how to prevent them.',
    """
As your OCR tutor: spec section 1.4 on Paper 1. The top-mark technique is to MATCH each threat to the specific prevention that stops it, and explain how.

**Threats.**
• Malware — software written to cause harm: viruses (attach to files and spread when run), worms (spread themselves across networks), trojans (disguised as useful software), spyware (secretly records activity), ransomware (encrypts files and demands payment).
• Social engineering — manipulating people rather than technology. Phishing uses fake emails or messages pretending to be a trusted organisation to trick people into revealing details. People are often the weakest link.
• Brute-force attacks — trying every possible password combination until one works.
• Denial of service (DoS) — flooding a server with so many requests that it can't respond to genuine users.
• Data interception and theft — capturing data as it travels across a network (e.g. packet sniffing).
• SQL injection — typing SQL code into an input box so the database runs it, revealing or changing data.

**Prevention.**
• Penetration testing — authorised, simulated attacks to find weaknesses before criminals do.
• Anti-malware software — scans for, quarantines and removes known malware.
• Firewalls — monitor incoming and outgoing traffic and block it according to rules.
• User access levels — users can only see or change what their role needs.
• Passwords — strong passwords, plus locking the account after several failed attempts (defeats brute force).
• Encryption — intercepted data is unreadable without the key.
• Physical security — locks, CCTV, swipe cards, biometrics to protect the hardware itself.
• Input validation / parameterised queries — stops SQL injection.
""",
    ['Malware types: virus, worm, trojan, spyware, ransomware', 'Phishing = social engineering; people are the weakest link',
     'Brute force → account lockout and strong passwords', 'DoS floods a server so genuine users cannot get through',
     'Interception → encryption; SQL injection → input validation', 'Penetration testing = authorised simulated attack to find weaknesses'],
    [('What is a brute-force attack?', 'Trying every possible password combination until the right one is found.'),
     ('How does encryption protect intercepted data?', 'The data is scrambled and unreadable without the decryption key.'),
     ('What is SQL injection?', 'Entering SQL commands into an input field so the database executes them.'),
     ('What is penetration testing?', 'Authorised, simulated attacks on a system to find vulnerabilities so they can be fixed.')],
    [
        q('cs-sec-q1', 'What is phishing?', ['Flooding a server with requests', 'A program that copies itself across a network', 'Fake emails or messages pretending to be from a trusted organisation to trick people into giving away details', 'Testing a network for weaknesses'], 'Fake emails or messages pretending to be from a trusted organisation to trick people into giving away details', 'Phishing is a form of social engineering — it targets people, not technology.', 'foundation'),
        q('cs-sec-q2', 'What does a firewall do?', ['Monitors incoming and outgoing network traffic and blocks it according to rules', 'Encrypts every file on the hard drive', 'Removes viruses from infected files', 'Backs up data'], 'Monitors incoming and outgoing network traffic and blocks it according to rules', 'A firewall filters traffic between a network and the outside world.', 'foundation'),
        q('cs-sec-q3', "A website's login box is used to type database commands that reveal every user's record. What attack is this?", ['Brute force', 'Denial of service', 'Phishing', 'SQL injection'], 'SQL injection', 'The attacker injects SQL into an input so the database executes it.', 'intermediate'),
        q('cs-sec-q4', 'Which measure best defends against a brute-force password attack?', ['Using a larger monitor', 'Locking the account after a small number of failed attempts', 'Turning off encryption', 'Using a peer-to-peer network'], 'Locking the account after a small number of failed attempts', 'Lockouts stop an attacker from trying thousands of combinations.', 'intermediate'),
        q('cs-sec-q5', 'What is the aim of a denial of service (DoS) attack?', ['To steal passwords', 'To encrypt files and demand payment', 'To flood a server with requests so it cannot respond to genuine users', 'To gain physical access to a server room'], 'To flood a server with requests so it cannot respond to genuine users', 'DoS attacks make a service unavailable rather than stealing data.', 'higher'),
        q('cs-sec-q6', 'Why is encryption useful if data is intercepted?', ['It stops the data being intercepted', 'It speeds up transmission', 'It removes malware', 'The intercepted data is unreadable without the decryption key'], 'The intercepted data is unreadable without the decryption key', 'Encryption does not prevent interception — it makes the stolen data useless.', 'higher'),
        q('cs-sec-q7', 'Why do companies pay for penetration testing?', ['To find and fix vulnerabilities by simulating attacks before real criminals exploit them', 'To increase network speed', 'To install malware on competitors\' systems', 'Because it is required to use the internet'], 'To find and fix vulnerabilities by simulating attacks before real criminals exploit them', 'Pen testers are authorised to attack the system and report what they find.', 'higher'),
        q('cs-sec-q8', 'Which best describes ransomware?', ['A program that shows adverts', 'Malware that encrypts a victim\'s files and demands payment for the key', 'A physical lock on a server', 'A type of firewall'], "Malware that encrypts a victim's files and demands payment for the key", 'Ransomware holds data hostage until a ransom is paid.', 'further'),
        q('cs-sec-q9', 'A school gives students read-only access to shared folders but teachers can read and write. This is an example of:', ['Penetration testing', 'Encryption', 'Social engineering', 'User access levels'], 'User access levels', 'Access levels limit what each type of user can see and change.', 'further'),
        q('cs-sec-q10', 'Why are people often called the "weakest link" in network security?', ['Social engineering exploits human trust and mistakes, bypassing technical defences', 'People cannot use computers', 'Firewalls do not work when people are logged in', 'Passwords are always too long'], 'Social engineering exploits human trust and mistakes, bypassing technical defences', 'The strongest firewall is useless if someone hands over their password.', 'further'),
    ])

software = topic(
    'cs-software', P1, '1.5 Systems Software',
    'Operating system functions and utility software such as encryption, defragmentation and compression.',
    """
As your OCR tutor: spec section 1.5 on Paper 1. When asked for OS functions, name the function AND give an example of what it actually does.

**The operating system** manages the hardware and provides a platform for applications.
• User interface — lets the user interact with the computer: graphical (windows, icons, menus, pointers — intuitive for most users) or command line (typed commands — uses fewer resources, powerful and scriptable, but has to be learned).
• Memory management and multitasking — decides where programs and data are loaded in RAM, moves data between RAM and virtual memory, and shares CPU time between programs so several appear to run at once.
• Peripheral management and drivers — communicates with input/output devices. A device driver translates the OS's generic instructions into commands a specific piece of hardware understands.
• User management — creates user accounts, handles logins and passwords, and sets access rights.
• File management — names, organises (folders), moves, copies, saves and deletes files and controls permissions.

**Utility software** helps maintain and protect the computer.
• Encryption software scrambles data so it cannot be read without a key.
• Defragmentation reorganises a hard disk so the parts of each file are stored next to each other. The read/write head moves less, so files load faster. It is not needed for SSDs — they have no moving parts, and the extra writes would shorten their life.
• Data compression reduces file size, saving storage and making files quicker to send.
""",
    ['OS functions: user interface, memory management/multitasking, peripheral management and drivers, user management, file management',
     'GUI = intuitive; command line = fewer resources, powerful, scriptable', 'Device driver lets the OS talk to a specific piece of hardware',
     'Utilities: encryption, defragmentation, compression', 'Defragmentation helps HDDs (less head movement) — not needed for SSDs'],
    [('What is a device driver?', 'Software that lets the operating system communicate with a specific hardware device.'),
     ('What does memory management do?', 'Allocates RAM to programs, moves data to/from virtual memory, and lets several programs run at once.'),
     ('Why defragment a hard disk?', 'Parts of files are stored together, so the read/write head moves less and files load faster.'),
     ('Why not defragment an SSD?', 'No moving parts so there is little speed gain, and extra writes reduce its lifespan.')],
    [
        q('cs-sw-q1', 'Which is an example of utility software?', ['A word processor', 'A web browser game', 'Defragmentation software', 'A spreadsheet'], 'Defragmentation software', 'Utilities maintain or protect the computer; word processors and spreadsheets are applications.', 'foundation'),
        q('cs-sw-q2', 'What is the purpose of a device driver?', ['To let the operating system communicate with a specific piece of hardware', 'To speed up the CPU', 'To compress files', 'To protect against viruses'], 'To let the operating system communicate with a specific piece of hardware', 'Drivers translate OS instructions into commands the device understands.', 'foundation'),
        q('cs-sw-q3', 'Which OS function allows several programs to appear to run at the same time?', ['File management', 'User management', 'Defragmentation', 'Memory management and multitasking'], 'Memory management and multitasking', 'The OS shares CPU time and allocates RAM between running programs.', 'intermediate'),
        q('cs-sw-q4', 'Which OS function lets different people have their own accounts and access rights?', ['Peripheral management', 'User management', 'Compression', 'Encryption'], 'User management', 'User management handles accounts, logins and permissions.', 'intermediate'),
        q('cs-sw-q5', 'Why does defragmentation improve performance on a hard disk drive?', ['It deletes unused files', 'It increases the amount of RAM', 'It moves parts of files so they are stored together, so the read/write head moves less', 'It encrypts the data'], 'It moves parts of files so they are stored together, so the read/write head moves less', 'Less mechanical movement means faster reading of files.', 'higher'),
        q('cs-sw-q6', 'Why should an SSD not usually be defragmented?', ['SSDs cannot store files', 'SSDs have no moving parts so fragmentation barely affects speed, and extra writes shorten the drive\'s life', 'Defragmentation deletes SSD data', 'SSDs are volatile'], "SSDs have no moving parts so fragmentation barely affects speed, and extra writes shorten the drive's life", 'SSD access time is the same wherever data is stored.', 'higher'),
        q('cs-sw-q7', 'Which feature of a GUI makes it suitable for most users?', ['Commands must be memorised', 'It only works for experts', 'It uses less memory than any other interface', 'It uses windows, icons, menus and pointers, so it is intuitive without learning commands'], 'It uses windows, icons, menus and pointers, so it is intuitive without learning commands', 'GUIs are designed to be easy to pick up.', 'higher'),
        q('cs-sw-q8', 'A network technician prefers a command-line interface. What is the best reason?', ['It is easier for beginners', 'It has colourful icons', 'It uses fewer resources and allows precise commands and scripting of repetitive tasks', 'It cannot be automated'], 'It uses fewer resources and allows precise commands and scripting of repetitive tasks', 'Experts value the speed, power and automation of typed commands.', 'further'),
        q('cs-sw-q9', 'Which OS function decides where in RAM a program is loaded?', ['Memory management', 'File management', 'User interface', 'Peripheral management'], 'Memory management', 'Memory management allocates and tracks RAM usage.', 'further'),
        q('cs-sw-q10', 'Why is compression software useful before emailing a large set of files?', ['It encrypts them', 'It removes viruses', 'It defragments them', 'It reduces file size so they transfer faster and fit under attachment size limits'], 'It reduces file size so they transfer faster and fit under attachment size limits', 'Smaller files use less bandwidth and storage.', 'further'),
    ])

impacts = topic(
    'cs-impacts', P1, '1.6 Ethical, Legal, Cultural and Environmental Impacts',
    'Data Protection Act, Computer Misuse Act, Copyright Act, software licences and the wider impacts of technology.',
    """
As your OCR tutor: spec section 1.6 on Paper 1 is where the extended-response (8-mark) question often lands. Structure it: make a point, link it to a stakeholder, and cover both benefits and drawbacks across ethical, legal, cultural, environmental and privacy issues.

**Legislation.**
• Data Protection Act 2018 (the UK's version of GDPR): personal data must be processed lawfully, fairly and transparently; used only for specified purposes; adequate and relevant; accurate; kept no longer than necessary; and kept secure. People have the right to see the data held about them and to have mistakes corrected.
• Computer Misuse Act 1990 created three offences: unauthorised access to computer material (hacking); unauthorised access with intent to commit further crimes; and unauthorised acts that impair the operation of a computer (e.g. spreading malware).
• Copyright, Designs and Patents Act 1988 protects creators' work (software, music, films, images) from being copied or shared without permission.

**Software licences.** Open source: the source code is available to view, modify and share, often free, supported by a community. Proprietary: the source code is closed, you pay for a licence to use it, and cannot modify it, but it usually comes with professional support and regular updates.

**Wider impacts.** Ethical: privacy, surveillance, algorithms making decisions about people. Cultural: how we communicate and work, and the digital divide (the gap between those with and without access to technology). Environmental: e-waste containing toxic materials, energy used by data centres, mining raw materials — but also benefits such as video calls reducing travel and smart systems saving energy.
""",
    ['Data Protection Act 2018: fair, lawful use; accurate; not kept longer than needed; secure; right of access',
     'Computer Misuse Act 1990: unauthorised access; access with intent; impairing a computer (malware)',
     'Copyright, Designs and Patents Act 1988: protects creative work, including software',
     'Open source = code available to modify/share; proprietary = closed code, paid licence, supported',
     'Environmental: e-waste, energy use, raw materials — but less travel and smarter energy use',
     'Digital divide: gap between people with and without access to technology'],
    [('Three offences under the Computer Misuse Act?', 'Unauthorised access; unauthorised access with intent to commit further offences; unauthorised acts that impair a computer.'),
     ('Name two Data Protection principles.', 'E.g. data must be accurate, and must not be kept longer than necessary (also: kept secure, used for specified purposes).'),
     ('Open source vs proprietary?', 'Open source: code visible and modifiable, usually free. Proprietary: closed code, paid licence, professional support.'),
     ('What is the digital divide?', 'The gap between people who have access to technology and the internet and those who do not.')],
    [
        q('cs-imp-q1', 'Which law makes it illegal to gain unauthorised access to a computer system?', ['Data Protection Act 2018', 'Copyright, Designs and Patents Act 1988', 'Computer Misuse Act 1990', 'Freedom of Information Act'], 'Computer Misuse Act 1990', 'Hacking is the first offence under the Computer Misuse Act.', 'foundation'),
        q('cs-imp-q2', 'What is e-waste?', ['Deleted emails', 'Discarded electronic devices, which can contain toxic materials', 'Spam messages', 'Unused storage space'], 'Discarded electronic devices, which can contain toxic materials', 'E-waste is a growing environmental problem when not recycled safely.', 'foundation'),
        q('cs-imp-q3', 'Which law gives people the right to see the personal data an organisation holds about them?', ['Data Protection Act 2018', 'Computer Misuse Act 1990', 'Copyright, Designs and Patents Act 1988', 'Health and Safety at Work Act'], 'Data Protection Act 2018', 'The right of access is one of the data subject rights under the DPA 2018.', 'intermediate'),
        q('cs-imp-q4', 'What is a key feature of open-source software?', ['It always costs a licence fee', 'It can never be updated', 'Users are forbidden from sharing it', 'Its source code can be viewed, modified and shared'], 'Its source code can be viewed, modified and shared', 'Open source means the source code is openly available.', 'intermediate'),
        q('cs-imp-q5', 'Copying and sharing a paid-for game online without permission breaks which law?', ['Computer Misuse Act 1990', 'Copyright, Designs and Patents Act 1988', 'Data Protection Act 2018', 'No law'], 'Copyright, Designs and Patents Act 1988', "Software is protected as the creator's work.", 'higher'),
        q('cs-imp-q6', 'A company keeps customers\' old addresses for 20 years "just in case". Which Data Protection principle does this break?', ['Data must not be kept longer than necessary', 'Data must be kept on a computer', 'Data must be encrypted with a particular algorithm', 'Data must be shared with partners'], 'Data must not be kept longer than necessary', 'Storage limitation: personal data should be deleted once it is no longer needed.', 'higher'),
        q('cs-imp-q7', 'Why might a business choose proprietary software rather than open source?', ['The source code can be edited freely', 'It is always free', 'It comes with professional support and a company responsible for tested updates', 'It cannot contain bugs'], 'It comes with professional support and a company responsible for tested updates', 'Businesses often value guaranteed support and accountability.', 'higher'),
        q('cs-imp-q8', "Spreading ransomware to encrypt a hospital's files is an offence under which part of the Computer Misuse Act?", ['Unauthorised acts with intent to impair the operation of a computer', 'It is not covered by the Act', 'Copyright infringement', 'Unauthorised access only'], 'Unauthorised acts with intent to impair the operation of a computer', 'Spreading malware that damages or disables systems is the third CMA offence.', 'further'),
        q('cs-imp-q9', 'Which is an environmental BENEFIT of technology?', ['Mining rare metals for components', 'Energy used by data centres', 'E-waste sent to landfill', 'Video conferencing reducing the need to travel'], 'Video conferencing reducing the need to travel', 'Less travel means lower carbon emissions.', 'further'),
        q('cs-imp-q10', 'What is meant by the "digital divide"?', ['The split between hardware and software', 'The gap between people who have access to technology and the internet and those who do not', 'The difference between binary and denary', 'The split between LAN and WAN'], 'The gap between people who have access to technology and the internet and those who do not', 'The divide can be caused by cost, location, age or skills.', 'further'),
    ])

algorithms = topic(
    'cs-algorithms', P2, '2.1 Algorithms',
    'Computational thinking, pseudocode and flowcharts, trace tables, and searching and sorting algorithms.',
    """
As your OCR tutor: spec section 2.1 on Paper 2 (J277/02). You must be able to describe AND carry out each search and sort on a given list, showing each step — practise writing out every pass.

**Computational thinking.** Abstraction: removing unnecessary detail to focus on what matters (a tube map ignores real distances). Decomposition: breaking a problem into smaller sub-problems that are easier to solve. Algorithmic thinking: working out the logical steps needed to reach a solution.

**Designing algorithms.** Identify the inputs, processes and outputs. Use structure diagrams for decomposition. Write pseudocode (OCR Exam Reference Language) or draw flowcharts: terminal = rounded rectangle, process = rectangle, decision = diamond, input/output = parallelogram, sub-program = rectangle with double side lines.

**Trace tables** record the value of each variable as you follow the algorithm line by line — used to find logic errors and work out outputs.

**Searching.** Linear search checks each item in turn from the start. It works on unsorted lists but is slow on large ones (worst case: every item). Binary search needs a SORTED list: check the middle item; if it is not the target, discard the half that can't contain it and repeat. Each comparison halves the list, so it is far faster on large lists (about 10 comparisons for 1,000 items).

**Sorting.** Bubble sort: compare each adjacent pair and swap if in the wrong order; repeat passes until a pass makes no swaps. Simple but slow on large lists. Merge sort: split the list into single items, then repeatedly merge pairs of sub-lists in order. Much faster on large lists but uses more memory. Insertion sort: take each item in turn and insert it into the correct place in the already-sorted part. Good for small or nearly sorted lists.
""",
    ['Abstraction = remove unnecessary detail; decomposition = break into sub-problems',
     'Flowchart: diamond = decision, parallelogram = input/output, rectangle = process',
     'Trace tables track variable values line by line', 'Linear search works on unsorted lists; binary search needs sorted data and halves the list each time',
     'Bubble: swap adjacent pairs until no swaps; merge: split then merge; insertion: insert each item into the sorted part'],
    [('What must be true before a binary search?', 'The list must be sorted.'),
     ('How does a bubble sort know it has finished?', 'A full pass is completed with no swaps.'),
     ('Why is merge sort faster than bubble sort on large lists?', 'It splits and merges, needing far fewer comparisons overall (though it uses more memory).'),
     ('Give an example of abstraction.', 'A tube map — it keeps stations and connections but removes real distances and streets.')],
    [
        q('cs-alg-q1', 'What is decomposition?', ['Removing unnecessary detail', 'Breaking a problem down into smaller, more manageable sub-problems', 'Writing code in binary', 'Sorting data alphabetically'], 'Breaking a problem down into smaller, more manageable sub-problems', 'Decomposition makes a big problem manageable.', 'foundation'),
        q('cs-alg-q2', 'Which flowchart symbol represents a decision?', ['Rectangle', 'Parallelogram', 'Rounded rectangle', 'Diamond'], 'Diamond', 'Decisions (yes/no questions) use a diamond.', 'foundation'),
        q('cs-alg-q3', 'A map of the London Underground ignores real distances and street layouts. This is an example of:', ['Abstraction', 'Decomposition', 'Iteration', 'Validation'], 'Abstraction', 'Abstraction removes detail that is not needed for the task.', 'intermediate'),
        q('cs-alg-q4', 'What must be true about a list before a binary search can be used?', ['It must contain only numbers', 'It must have fewer than 100 items', 'It must be sorted', 'It must be unsorted'], 'It must be sorted', 'Binary search relies on order to discard half the list each time.', 'intermediate'),
        q('cs-alg-q5', 'What is a trace table used for?', ['Drawing flowcharts', 'Encrypting data', 'Sorting lists', 'Recording the values of variables as an algorithm is followed step by step'], 'Recording the values of variables as an algorithm is followed step by step', 'Trace tables help find logic errors and predict output.', 'intermediate'),
        q('cs-alg-q6', 'Using binary search on [3, 8, 12, 19, 24, 31, 40] to find 31, which item is checked first?', ['3', '19', '31', '40'], '19', 'The middle of the 7 items is the 4th item, 19. As 31 > 19, the left half is discarded.', 'higher'),
        q('cs-alg-q7', 'What is the list after the FIRST pass of a bubble sort on [5, 2, 9, 1]?', ['[1, 2, 5, 9]', '[2, 5, 1, 9]', '[2, 5, 9, 1]', '[5, 2, 1, 9]'], '[2, 5, 1, 9]', '5,2 swap → [2,5,9,1]; 5,9 no swap; 9,1 swap → [2,5,1,9]. The largest value has "bubbled" to the end.', 'higher'),
        q('cs-alg-q8', 'Why is merge sort usually faster than bubble sort for very large lists?', ['It never compares items', 'It only works on numbers', 'It repeatedly splits the list and merges sorted sub-lists, needing far fewer comparisons overall', 'It sorts in a single pass'], 'It repeatedly splits the list and merges sorted sub-lists, needing far fewer comparisons overall', 'Merge sort scales much better, at the cost of extra memory.', 'higher'),
        q('cs-alg-q9', 'A linear search is used on an unsorted list of 1,000 names. What is the maximum number of comparisons?', ['1', '10', '500', '1,000'], '1,000', 'In the worst case the item is last (or missing), so every item is checked.', 'further'),
        q('cs-alg-q10', 'A sorted list has 1,024 items. Roughly how many comparisons does a binary search need at most?', ['About 100', 'About 512', 'About 10 or 11', 'About 1,024'], 'About 10 or 11', '1,024 halves to 1 in 10 steps (2¹⁰ = 1,024), so around 10–11 comparisons.', 'further'),
        q('cs-alg-q11', 'Which sort builds a sorted section one item at a time, placing each new item in its correct position?', ['Insertion sort', 'Bubble sort', 'Merge sort', 'Binary sort'], 'Insertion sort', 'Insertion sort grows a sorted part at the front of the list.', 'further'),
    ])

programming = topic(
    'cs-programming-fundamentals', P2, '2.2 Programming Fundamentals',
    'Variables, data types, operators, selection and iteration, strings, arrays, SQL, file handling and sub-programs (Python).',
    """
As your OCR tutor: spec section 2.2 on Paper 2. Section B of Paper 2 asks you to write and fix real code, in OCR Exam Reference Language or Python — your school uses Python, so practise writing it by hand.

**Variables, constants and data types.** A variable's value can change while the program runs; a constant's cannot. Data types: integer (whole numbers), real/float (decimals), Boolean (True/False), character, string. Casting converts between types: int("7") gives 7, str(7) gives "7".

**Operators.** Arithmetic: + − * /, exponent (^ in OCR, ** in Python), MOD (remainder — % in Python), DIV (whole-number division — // in Python). So 17 MOD 5 = 2 and 17 DIV 5 = 3. Comparison: == != < <= > >=. Boolean: AND, OR, NOT.

**The three constructs.** Sequence (one line after another), selection (if / elif / else, and switch/case in OCR pseudocode), iteration: count-controlled loops (for — the number of repetitions is known) and condition-controlled loops (while — repeat until a condition changes).

**Strings.** Length (len), substrings/slicing (word[0:3] gives the first three characters), upper/lower case, concatenation (+), and converting characters to and from ASCII codes (ord/chr).

**Arrays and records.** An array stores several values of the same type under one name, accessed by an index starting at 0. 2D arrays are like tables: grid[row][column]. Records group related fields of different types.

**SQL.** SELECT field(s) FROM table WHERE condition — e.g. SELECT Name FROM Students WHERE Year = 10. Use * to select all fields.

**File handling.** Open, read or write, then close the file.

**Sub-programs.** Functions return a value; procedures do not. Parameters pass values in. Local variables exist only inside the sub-program; global variables can be used anywhere. Sub-programs make code reusable, easier to test and easier to maintain.
""",
    ['Variable can change; constant cannot. Types: integer, real, Boolean, character, string', 'MOD = remainder (17 MOD 5 = 2); DIV = whole-number division (17 DIV 5 = 3)',
     'Sequence, selection (if/elif/else), iteration (for = count-controlled, while = condition-controlled)', 'Arrays are indexed from 0; 2D arrays use [row][column]',
     'SQL: SELECT fields FROM table WHERE condition', 'Function returns a value; procedure does not; local vs global scope'],
    [('17 MOD 5 and 17 DIV 5?', 'MOD gives the remainder, 2. DIV gives the whole-number part, 3.'),
     ('When would you use a while loop instead of a for loop?', 'When you do not know in advance how many times to repeat — loop until a condition is met.'),
     ('What does "Purbeck"[0:3] give in Python?', '"Pur" — characters at index 0, 1 and 2.'),
     ('Function vs procedure?', 'A function returns a value; a procedure carries out a task without returning a value.')],
    [
        q('cs-prog-q1', 'What is the value of 17 MOD 5?', ['3', '2', '3.4', '12'], '2', 'MOD gives the remainder: 17 = 3 × 5 + 2.', 'foundation'),
        q('cs-prog-q2', 'Which data type is most suitable for storing whether a user is logged in?', ['String', 'Integer', 'Real', 'Boolean'], 'Boolean', 'A Boolean holds True or False.', 'foundation'),
        q('cs-prog-q3', 'What is the value of 17 DIV 5?', ['3', '2', '3.4', '85'], '3', 'DIV gives the whole number of times 5 goes into 17.', 'intermediate'),
        q('cs-prog-q4', 'In Python, what does len("Purbeck") return?', ['6', '8', '7', '"P"'], '7', 'The string has 7 characters.', 'intermediate'),
        q('cs-prog-q5', 'An array marks stores [12, 7, 19, 4]. What is marks[2]?', ['7', '12', '4', '19'], '19', 'Arrays are indexed from 0, so index 2 is the third item.', 'intermediate'),
        q('cs-prog-q6', 'What does this Python code output?\nfor i in range(1, 4):\n    print(i * 2)', ['1, 2, 3', '2, 4, 6', '2, 4, 6, 8', '0, 2, 4'], '2, 4, 6', 'range(1, 4) gives 1, 2 and 3 (the end value is excluded), each doubled.', 'higher'),
        q('cs-prog-q7', 'What is the difference between a function and a procedure?', ['A procedure returns a value; a function does not', 'They are identical', 'A function returns a value; a procedure does not', 'Functions cannot take parameters'], 'A function returns a value; a procedure does not', 'Both are sub-programs; only functions give a value back.', 'higher'),
        q('cs-prog-q8', 'Which SQL statement returns the names of all students in Year 10?', ['GET Name IN Students IF Year = 10', 'SELECT Name FROM Students WHERE Year = 10', 'SELECT Students FROM Name WHERE 10', 'FIND Name WHERE Students = 10'], 'SELECT Name FROM Students WHERE Year = 10', 'SELECT field FROM table WHERE condition.', 'higher'),
        q('cs-prog-q9', 'What is the result of int("7") + 3 in Python?', ['10', '"73"', 'An error', '7.3'], '10', 'int("7") casts the string to the integer 7, then 7 + 3 = 10.', 'higher'),
        q('cs-prog-q10', 'A variable declared inside a sub-program that can only be used there is a:', ['Global variable', 'Constant', 'Parameter array', 'Local variable'], 'Local variable', 'Local variables exist only while the sub-program runs.', 'further'),
        q('cs-prog-q11', 'What does this Python code print?\nword = "Spanish"\nprint(word[0:3])', ['Span', 'Spa', 'pan', 'S'], 'Spa', 'Slicing [0:3] gives indexes 0, 1 and 2.', 'further'),
        q('cs-prog-q12', 'What is the best reason to use a while loop instead of a for loop?', ['The loop must repeat until a condition is met and the number of repetitions is not known in advance', 'The number of repetitions is known in advance', 'While loops always run faster', 'For loops cannot use variables'], 'The loop must repeat until a condition is met and the number of repetitions is not known in advance', 'While is condition-controlled; for is count-controlled.', 'further'),
    ])

robust = topic(
    'cs-robust', P2, '2.3 Producing Robust Programs',
    'Defensive design, validation and authentication, maintainability, testing, errors and test data.',
    """
As your OCR tutor: spec section 2.3 on Paper 2. Test-data questions are very common — learn OCR's exact four categories and be able to give an example of each for any range.

**Defensive design** means anticipating how a program could be misused or break. Input validation checks data is sensible before it is used: range check (between limits), type check (right data type), presence check (not left blank), format check (e.g. a postcode pattern), length check (e.g. password at least 8 characters). Authentication confirms who a user is — usernames and passwords, for example. Validation checks the DATA; authentication checks the USER.

**Maintainability** makes code easier for others (or you, later) to understand and change: comments, meaningful variable and sub-program names, consistent indentation, and splitting code into sub-programs.

**Testing** checks that the program works as intended and finds errors. Iterative testing happens during development — each module is tested as it is written. Final (terminal) testing happens at the end, on the whole program.

**Errors.** Syntax errors break the rules of the language, so the program won't translate or run (e.g. a missing bracket). Logic errors let the program run but it produces the wrong result (e.g. dividing by 2 instead of 3 for an average).

**Test data (OCR's definitions)** for a program that accepts ages 11–18:
• Normal — typical valid data that should be accepted: 15.
• Boundary — valid data on the very edge of the range: 11 or 18.
• Invalid — the correct data type but should be rejected: 25.
• Erroneous — the wrong data type, which should be rejected: "sixteen".
""",
    ['Validation checks: range, type, presence, format, length', 'Authentication checks WHO the user is (e.g. username and password)',
     'Maintainability: comments, meaningful names, indentation, sub-programs', 'Iterative testing during development; final testing at the end',
     'Syntax error = breaks language rules; logic error = runs but wrong result', 'Test data: normal, boundary, invalid (right type, rejected), erroneous (wrong type)'],
    [('Validation vs authentication?', 'Validation checks the input data is sensible; authentication checks the identity of the user.'),
     ('Invalid vs erroneous test data?', 'Invalid is the correct data type but outside what is allowed; erroneous is the wrong data type.'),
     ('Syntax vs logic error?', 'Syntax errors stop the code running; logic errors let it run but give the wrong answer.'),
     ('Why test iteratively?', 'Errors are found in each module as it is written, when they are easier to locate and fix.')],
    [
        q('cs-rob-q1', 'What type of error stops a program running because it breaks the rules of the language?', ['Logic error', 'Syntax error', 'Boundary error', 'Normal error'], 'Syntax error', 'Syntax errors must be fixed before the code can be translated.', 'foundation'),
        q('cs-rob-q2', 'What is the purpose of a comment in code?', ['To make the program run faster', 'To validate input', 'To explain what the code does for anyone maintaining it; it is ignored when the program runs', 'To encrypt the code'], 'To explain what the code does for anyone maintaining it; it is ignored when the program runs', 'Comments improve maintainability.', 'foundation'),
        q('cs-rob-q3', 'A program accepts ages 11 to 18. Which is BOUNDARY test data?', ['15', '25', '"sixteen"', '18'], '18', 'Boundary data sits at the very edge of the valid range.', 'intermediate'),
        q('cs-rob-q4', 'Which validation check makes sure a field has not been left blank?', ['Presence check', 'Range check', 'Type check', 'Format check'], 'Presence check', 'A presence check rejects empty input.', 'intermediate'),
        q('cs-rob-q5', 'A program should average 3 marks but adds them and divides by 2. It runs but gives wrong answers. What type of error is this?', ['Syntax error', 'Presence error', 'Logic error', 'Translation error'], 'Logic error', 'The code is valid but the logic is wrong.', 'higher'),
        q('cs-rob-q6', 'For a program accepting ages 11–18, "sixteen" is which kind of test data?', ['Normal', 'Boundary', 'Invalid', 'Erroneous'], 'Erroneous', 'It is the wrong data type (text, not a number), so it is erroneous.', 'higher'),
        q('cs-rob-q7', 'For the same program, entering 25 is which kind of test data?', ['Invalid', 'Normal', 'Boundary', 'Erroneous'], 'Invalid', 'It is the correct type (a number) but outside the range, so it is invalid.', 'higher'),
        q('cs-rob-q8', 'Why is iterative testing carried out during development rather than only at the end?', ['It is required by law', 'Errors in each module are found and fixed as it is written, when they are easier to locate', 'It removes the need for final testing', 'It makes programs smaller'], 'Errors in each module are found and fixed as it is written, when they are easier to locate', 'Catching problems early is cheaper and easier.', 'further'),
        q('cs-rob-q9', 'Which of these is authentication rather than validation?', ['Checking an email address contains an @', 'Checking a number is between 1 and 10', 'Checking a field is not empty', "Requiring a username and password to confirm the user's identity"], "Requiring a username and password to confirm the user's identity", 'Authentication is about who the user is.', 'further'),
        q('cs-rob-q10', 'Which change most improves maintainability?', ['Splitting code into well-named sub-programs with comments and consistent indentation', 'Using single-letter variable names', 'Putting all the code on one line', 'Removing comments to save space'], 'Splitting code into well-named sub-programs with comments and consistent indentation', 'Clear structure and naming make code easier to understand and change.', 'further'),
    ])

boolean = topic(
    'cs-boolean', P2, '2.4 Boolean Logic',
    'AND, OR and NOT gates, truth tables, logic diagrams and Boolean expressions.',
    """
As your OCR tutor: spec section 2.4 on Paper 2. Draw the truth table even when the question doesn't ask for one — it stops careless mistakes.

**The three gates.** AND outputs 1 only if both inputs are 1. OR outputs 1 if either input (or both) is 1. NOT has one input and inverts it (1 → 0, 0 → 1). Know the symbols: AND is a D shape, OR is a curved shield/arrow shape, NOT is a triangle with a small circle on its output.

**Truth tables** list every combination of inputs and the resulting output. With n inputs there are 2ⁿ rows: 2 inputs → 4 rows, 3 inputs → 8 rows.

**Combining gates.** Work from the inputs towards the output, one gate at a time. For P = (A AND B) OR NOT C, first work out A AND B, then NOT C, then OR the two results. Brackets show what is worked out first.

**Real problems.** Turn words into logic: "The alarm sounds if the door is open AND the alarm is set" gives A = D AND S. Watch for "or" (either condition is enough) and "not" (a condition must be false).
""",
    ['AND: 1 only if both inputs are 1', 'OR: 1 if at least one input is 1', 'NOT: inverts its single input',
     'Truth table rows = 2ⁿ for n inputs (3 inputs → 8 rows)', 'Work combined expressions from the inputs outwards, brackets first',
     'Translate real conditions word by word into AND/OR/NOT'],
    [('When does AND output 1?', 'Only when both inputs are 1.'),
     ('How many rows in a truth table with 3 inputs?', '2³ = 8 rows.'),
     ('Evaluate NOT (1 OR 0).', '1 OR 0 = 1, and NOT 1 = 0.'),
     ('Describe the NOT gate symbol.', 'A triangle with a small circle on the output.')],
    [
        q('cs-bool-q1', 'What is the output of 1 AND 0?', ['1', '0', '2', 'Undefined'], '0', 'AND only outputs 1 when both inputs are 1.', 'foundation'),
        q('cs-bool-q2', 'What is the output of NOT 1?', ['0', '1', '-1', '2'], '0', 'NOT inverts its input.', 'foundation'),
        q('cs-bool-q3', 'How many rows (not counting the header) does a truth table with 3 inputs have?', ['3', '6', '9', '8'], '8', '2³ = 8 input combinations.', 'intermediate'),
        q('cs-bool-q4', 'Which gate outputs 1 when at least one input is 1?', ['AND', 'NOT', 'OR', 'None of them'], 'OR', 'OR is true if either or both inputs are true.', 'intermediate'),
        q('cs-bool-q5', 'Evaluate (1 AND 1) OR 0.', ['0', '1', '2', 'Cannot be determined'], '1', '1 AND 1 = 1; 1 OR 0 = 1.', 'higher'),
        q('cs-bool-q6', 'Evaluate NOT (A OR B) when A = 0 and B = 1.', ['1', 'Undefined', '0', '2'], '0', 'A OR B = 1; NOT 1 = 0.', 'higher'),
        q('cs-bool-q7', 'An alarm sounds (A = 1) if the door is open (D = 1) AND the alarm is set (S = 1). Which expression is correct?', ['A = D OR S', 'A = NOT D', 'A = D AND NOT S', 'A = D AND S'], 'A = D AND S', 'Both conditions must be true, so AND.', 'higher'),
        q('cs-bool-q8', 'For P = (A AND B) OR NOT C, what is P when A = 1, B = 0 and C = 0?', ['1', '0', 'Undefined', 'Cannot tell'], '1', 'A AND B = 0; NOT C = 1; 0 OR 1 = 1.', 'further'),
        q('cs-bool-q9', 'For P = NOT (A AND B), which inputs make P = 0?', ['A = 0, B = 0', 'A = 0, B = 1', 'A = 1, B = 0', 'A = 1, B = 1'], 'A = 1, B = 1', 'A AND B is only 1 when both are 1, and NOT of that is 0.', 'further'),
        q('cs-bool-q10', 'A heater (H) turns on if it is cold (C) and someone is home (P), or if frost protection (F) is on. Which expression matches?', ['H = C AND (P OR F)', 'H = (C AND P) OR F', 'H = C OR P OR F', 'H = NOT (C AND P)'], 'H = (C AND P) OR F', 'Cold AND home together, OR frost protection on its own.', 'further'),
    ])

languages = topic(
    'cs-languages', P2, '2.5 Programming Languages and IDEs',
    'High- and low-level languages, compilers, interpreters and assemblers, and IDE features.',
    """
As your OCR tutor: spec section 2.5 on Paper 2. Compiler vs interpreter is a classic compare question — give a point for each side, not just a list of facts about one.

**High-level languages** (Python, Java, C#) are close to English, easier to write and debug, and portable between different processors. One high-level statement usually becomes many machine code instructions, and the code must be translated before it runs.

**Low-level languages.** Machine code is binary that the CPU executes directly. Assembly language uses mnemonics (e.g. LDA, ADD) with roughly one assembly instruction per machine code instruction; it is specific to one type of processor. Low-level code gives direct control of hardware and can be very fast and memory-efficient, which is why it is used for embedded systems and device drivers — but it is much harder to write and not portable.

**Translators.**
• Compiler — translates the whole program into machine code in one go, producing an executable file. Errors are reported after compilation. The executable runs quickly, doesn't need the translator, and the source code stays hidden.
• Interpreter — translates and runs the program one line at a time, stopping at the first error. Great while developing and debugging, but the program runs more slowly and the interpreter is needed every time.
• Assembler — translates assembly language into machine code.

**IDE (Integrated Development Environment) features.** Editor: syntax highlighting, auto-indentation, auto-completion, line numbers. Error diagnostics: highlight errors and give their line and type. Run-time environment: run the program and see its output. Translator: a built-in compiler or interpreter. Debugging tools: breakpoints (pause at a chosen line), stepping through line by line, and watching variables.
""",
    ['High-level: English-like, portable, must be translated; one statement → many machine instructions',
     'Low-level: machine code (binary) and assembly (mnemonics) — processor-specific, direct hardware control',
     'Compiler: whole program at once → fast executable, source hidden, errors reported at the end',
     'Interpreter: line by line, stops at first error — good for debugging, slower, needed every run',
     'Assembler: assembly → machine code', 'IDE: editor, error diagnostics, run-time environment, translator, breakpoints'],
    [('Two advantages of a compiler?', 'The executable runs fast without the translator, and the source code stays hidden.'),
     ('Why use an interpreter while developing?', 'It stops at the first error and shows where it is, so you can fix and re-run quickly.'),
     ('What does an assembler do?', 'Translates assembly language mnemonics into machine code.'),
     ('What is a breakpoint?', 'A chosen line where the program pauses so you can inspect variable values.')],
    [
        q('cs-lang-q1', 'Which of these is a high-level language?', ['Machine code', 'Assembly language', 'Binary', 'Python'], 'Python', 'Python is English-like and must be translated before it runs.', 'foundation'),
        q('cs-lang-q2', 'What does a translator do?', ['Converts source code into machine code the CPU can execute', 'Stores programs in RAM', 'Validates input', 'Encrypts programs'], 'Converts source code into machine code the CPU can execute', 'Compilers, interpreters and assemblers are all translators.', 'foundation'),
        q('cs-lang-q3', 'Which translator converts assembly language into machine code?', ['Compiler', 'Assembler', 'Interpreter', 'Linker'], 'Assembler', 'Assemblers handle assembly language specifically.', 'intermediate'),
        q('cs-lang-q4', 'Which IDE feature shows keywords in different colours to help spot mistakes?', ['Breakpoints', 'Run-time environment', 'Syntax highlighting', 'Compiler'], 'Syntax highlighting', 'Colour-coding makes typos and structure easier to see.', 'intermediate'),
        q('cs-lang-q5', 'A developer wants to sell a program without users seeing the source code. Which translator is most suitable?', ['Interpreter', 'Assembler', 'Text editor', 'Compiler'], 'Compiler', 'A compiler produces an executable, so the source code does not need to be shared.', 'higher'),
        q('cs-lang-q6', 'Why is an interpreter useful while a program is being developed?', ['It stops at the first error and shows the line, so errors can be found and fixed as the code runs', 'It produces a fast executable file', 'It hides the source code', 'It translates machine code into Python'], 'It stops at the first error and shows the line, so errors can be found and fixed as the code runs', 'Line-by-line translation makes debugging quicker.', 'higher'),
        q('cs-lang-q7', 'Why might a programmer choose assembly language over a high-level language?', ['It is easier to learn', 'It runs on any processor', 'It gives direct control of hardware and can be very fast and memory-efficient on a specific processor', 'It needs no translator'], 'It gives direct control of hardware and can be very fast and memory-efficient on a specific processor', 'Useful for embedded systems and drivers where efficiency matters.', 'higher'),
        q('cs-lang-q8', 'Which statement about compiled programs is correct?', ['They must be translated every time they run', 'Once compiled, the executable runs without the translator and usually runs faster than interpreted code', 'They cannot contain errors', 'They always run more slowly than interpreted code'], 'Once compiled, the executable runs without the translator and usually runs faster than interpreted code', 'Translation happens once, up front.', 'further'),
        q('cs-lang-q9', 'What is a breakpoint in an IDE?', ['A syntax error', 'The end of the program', 'A point where the program deliberately pauses so the programmer can inspect variable values', 'A type of loop'], 'A point where the program deliberately pauses so the programmer can inspect variable values', 'Breakpoints are a key debugging tool.', 'further'),
        q('cs-lang-q10', 'One line of high-level code usually translates into:', ['Exactly one machine code instruction', 'No machine code', 'One assembly mnemonic', 'Many machine code instructions'], 'Many machine code instructions', 'High-level statements are more abstract, so each becomes several low-level instructions.', 'further'),
    ])

subject = {
    'id': 'computerscience',
    'name': 'Computer Science',
    'icon': '💻',
    'color': '#0ea5e9',
    'examBoard': 'OCR',
    'specification': 'GCSE Computer Science (J277)',
    'units': [
        {'id': P1, 'subjectId': 'computerscience', 'name': 'Computer Systems',
         'topics': [architecture, memory, datarep, networks, security, software, impacts]},
        {'id': P2, 'subjectId': 'computerscience', 'name': 'Computational Thinking, Algorithms & Programming',
         'topics': [algorithms, programming, robust, boolean, languages]},
    ],
    'diagnosticQuestions': [],
}

if __name__ == '__main__':
    here = os.path.dirname(os.path.abspath(__file__))
    out = os.path.join(here, '..', '..', 'src', 'data', 'computerscience.ts')
    write_subject(out, 'computerScienceSubject', subject, 'OCR GCSE Computer Science (J277)')
