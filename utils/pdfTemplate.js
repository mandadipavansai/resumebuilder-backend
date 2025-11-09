




const React = require('react');
const { renderToStream } = require('@react-pdf/renderer');
// *** FIX: Import Link for clickable URLs ***
const { Page, Text, View, Document, StyleSheet, Link } = require('@react-pdf/renderer');


// --- STYLES FOR TEMPLATE 1: Academic --- (No functional changes)
const academicStyles = StyleSheet.create({
    page: { fontFamily: 'Times-Roman', fontSize: 11, padding: '1cm 1.4cm', color: '#333' },
    header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, borderBottomWidth: 1, borderBottomColor: '#333', paddingBottom: 10 },
    headerLeft: { maxWidth: '65%' },
    headerRight: { textAlign: 'right', fontSize: 9, maxWidth: '35%' },
    name: { fontSize: 28, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 5 },
    headerInfo: { fontSize: 9, marginBottom: 2 },
    link: { color: 'blue', fontWeight: 'bold',textDecoration: 'underline' },
    section: { marginBottom: 12 },
    sectionTitleContainer: { backgroundColor: '#f3f3f3', paddingVertical: 4, paddingHorizontal: 6, marginBottom: 8, borderBottomWidth: 1, borderBottomColor: '#ccc' },
    sectionTitle: { fontSize: 14, fontWeight: 'bold', textTransform: 'uppercase' },
    item: { marginBottom: 8 },
    itemHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
    itemTitle: { fontWeight: 'bold', fontSize: 11 },
    itemDate: { fontStyle: 'italic', fontSize: 10 },
    itemSubtitle: { fontStyle: 'italic', fontSize: 10, marginBottom: 3 },
    itemList: { marginLeft: 15, marginTop: 2 },
    bulletPoint: { flexDirection: 'row', marginBottom: 2 },
    bullet: { width: 10, fontSize: 10 },
    bulletText: { flex: 1, fontSize: 10 },
    skillsSection: { marginTop: 5 },
    skillItem: { flexDirection: 'row', marginBottom: 2 },
    skillCategory: { fontWeight: 'bold', fontSize: 10 },
    skillText: { fontSize: 10 },
});


// --- COMPONENT FOR TEMPLATE 1: Academic --- (Added Link rendering)
const AcademicTemplate = ({ resumeData }) => {
    const { personalDetails = {}, summary = '', experience = [], projects = [], education = [], skills = [] } = resumeData;

    const renderBulletPointsFromArray = (points) => {
        const pointArray = Array.isArray(points) ? points : (points ? [points] : []);
        return pointArray.map((point, j) => (
            <View key={j} style={academicStyles.bulletPoint}>
                <Text style={academicStyles.bullet}>•</Text>
                <Text style={academicStyles.bulletText}>{point}</Text>
            </View>
        ));
    };

    // Helper to format URLs for Links
    const formatUrl = (url) => {
        if (!url) return '';
        if (url.startsWith('http://') || url.startsWith('https://')) {
            return url;
        }
        return `https://${url.replace(/^https?:\/\//,'')}`;
    };

    return (
        <Document>
            <Page size="A4" style={academicStyles.page}>
                <View style={academicStyles.header}>
                    <View style={academicStyles.headerLeft}>
                        <Text style={academicStyles.name}>{personalDetails.name || 'Your Name'}</Text>
                        <Text style={academicStyles.headerInfo}>{personalDetails.professionalTitle || 'Professional Title'}</Text>
                    </View>
                    <View style={academicStyles.headerRight}>
                        <Text style={academicStyles.headerInfo}>{personalDetails.phone}</Text>
                        <Text style={academicStyles.headerInfo}>{personalDetails.email}</Text>
                        {personalDetails.linkedin && <Link style={[academicStyles.headerInfo, academicStyles.link]} src={formatUrl(personalDetails.linkedin)}>{personalDetails.linkedin}</Link>}
                        {personalDetails.github && <Link style={[academicStyles.headerInfo, academicStyles.link]} src={formatUrl(personalDetails.github)}>{personalDetails.github}</Link>}
                    </View>
                </View>
                
                {summary && (
                    <View style={academicStyles.section}>
                        <View style={academicStyles.sectionTitleContainer}><Text style={academicStyles.sectionTitle}>Summary</Text></View>
                        <Text style={academicStyles.summaryText || {}}>{summary}</Text>
                    </View>
                )}

                {education.length > 0 && (
                    <View style={academicStyles.section}>
                        <View style={academicStyles.sectionTitleContainer}><Text style={academicStyles.sectionTitle}>Education</Text></View>
                        {education.map((edu, i) => (
                            <View key={i} style={academicStyles.item}>
                                <View style={academicStyles.itemHeader}>
                                    <Text style={academicStyles.itemTitle}>{edu.universityName}</Text>
                                    <Text style={academicStyles.itemDate}>{edu.duration}</Text>
                                </View>
                                <Text style={academicStyles.itemSubtitle}>{edu.degree}</Text>
                                {edu.gpa && <Text style={academicStyles.itemSubtitle}>GPA: {edu.gpa}</Text>}
                                {/* *** ADDED LINK *** */}
                                {edu.link && <Link style={academicStyles.link} src={formatUrl(edu.link)}>{edu.link}</Link>}
                            </View>
                        ))}
                    </View>
                )}

                {projects.length > 0 && (
                    <View style={academicStyles.section}>
                        <View style={academicStyles.sectionTitleContainer}><Text style={academicStyles.sectionTitle}>Projects</Text></View>
                        {projects.map((proj, i) => (
                            <View key={i} style={academicStyles.item}>
                                <Text style={academicStyles.itemTitle}>{proj.projectTitle}</Text>
                                {/* *** ADDED LINK *** */}
                                {proj.link && <Link style={[academicStyles.itemSubtitle, academicStyles.link]} src={formatUrl(proj.link)}>{proj.link}</Link>}
                                {proj.description && <Text style={academicStyles.itemSubtitle}>{proj.description}</Text>}
                                <View style={academicStyles.itemList}>
                                    {renderBulletPointsFromArray(proj.bulletPoints)}
                                </View>
                            </View>
                        ))}
                    </View>
                )}
                
                {experience.length > 0 && (
                     <View style={academicStyles.section}>
                        <View style={academicStyles.sectionTitleContainer}><Text style={academicStyles.sectionTitle}>Experience</Text></View>
                        {experience.map((exp, i) => (
                            <View key={i} style={academicStyles.item}>
                                <View style={academicStyles.itemHeader}>
                                    <Text style={academicStyles.itemTitle}>{exp.jobTitle} at {exp.company}</Text>
                                    <Text style={academicStyles.itemDate}>{exp.duration}</Text>
                                </View>
                                <Text style={academicStyles.itemSubtitle}>{exp.location}</Text>
                                {/* *** ADDED LINK *** */}
                                {exp.link && <Link style={academicStyles.link} src={formatUrl(exp.link)}>{exp.link}</Link>}
                                 <View style={academicStyles.itemList}>
                                    {renderBulletPointsFromArray(exp.description)}
                                </View>
                            </View>
                        ))}
                    </View>
                )}
                
                {skills.length > 0 && (
                    <View style={academicStyles.section}>
                        <View style={academicStyles.sectionTitleContainer}><Text style={academicStyles.sectionTitle}>Technical Skills</Text></View>
                        <View style={academicStyles.skillsSection}>
                            {skills.map((skillLine, i) => {
                                if (!skillLine) return null;
                                const parts = skillLine.split(':');
                                const category = parts.length > 1 ? `${parts[0].trim()}: ` : '';
                                const skillsText = parts.length > 1 ? parts.slice(1).join(':').trim() : parts[0].trim();
                                return (
                                    <View key={i} style={academicStyles.skillItem}>
                                        <Text style={academicStyles.skillCategory}>{category}</Text>
                                        <Text style={academicStyles.skillText}>{skillsText}</Text>
                                    </View>
                                );
                            })}
                        </View>
                    </View>
                )}
            </Page>
        </Document>
    );
};


// --- STYLES FOR TEMPLATE 2: Professional (Targeted Modifications) ---
const professionalStyles = StyleSheet.create({
    // *** POINT 5 FIX: Use padding from PDF, not default ***
    page: { fontFamily: 'Helvetica', fontSize: 10, padding: '1cm 1.4cm', color: '#333' },
    // *** POINT 2 & 5 FIX: Centered header, NO border, and spacing ***
    header: { 
        textAlign: 'center', // Center align all text within
        marginBottom: 10 // Space after header
        // *** REMOVED Border from here ***
    },
    // *** POINT 1 & 5 FIX: Centered name, adjusted size, ensured black ***
    name: { 
        fontSize: 20, // Reduced from 26
        fontWeight: 'bold', 
        textTransform: 'uppercase', 
        marginBottom: 2, // Space between name and line
        color: '#333' // Ensure name is black
    },
    // *** NEW STYLE: The line you requested ***
    headerLine: {
        borderBottomWidth: 1,
        borderBottomColor: '#333',
        marginTop: 5,  // Space above line
        marginBottom: 5, // Space below line
        width: '100%',
    },
    // *** POINT 2 FIX: Style for the contact info row ***
    contactInfo: { 
        flexDirection: 'row',
        justifyContent: 'center',
        flexWrap: 'wrap', // Allow wrapping
        fontSize: 9,
        marginTop: 2, // Space above contact info
    },
    // *** NEW STYLE: For black text in header ***
    contactText: {
        fontSize: 9,
        color: '#333' // Ensure non-links are black
    },
    // *** NEW STYLE: For *blue* links in header (as per last request) ***
    contactLink: {
        fontSize: 9,
        color: 'blue', // Make header links blue
        textDecoration: 'none',
    },
    // *** NEW STYLE: For the separator ***
    separator: {
        fontSize: 9,
        marginHorizontal: 4, // Space around the '|'
        color: '#333' // Ensure separator is black
    },
    // Style for links in the *body* (kept blue)
    link: {
        color: 'blue',
        textDecoration: 'none',
        fontSize: 10,
        marginTop: 2,
    },
    // Removed unused title style
    title: { fontSize: 12, color: '#444', marginTop: 4 }, 
    
    section: { marginBottom: 10 }, // Reduced spacing
    // *** POINT 1 FIX: Ensured title is bold and added PDF-style border ***
    sectionTitle: { fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase', borderBottomWidth: 1, borderBottomColor: '#333', paddingBottom: 3, marginBottom: 6 },
    item: { marginBottom: 8 }, // Reduced spacing
    
    itemHeader: { flexDirection: 'row', justifyContent: 'space-between', fontSize: 10.5, marginBottom: 2 },
    // *** POINT 3 FIX: Added specific style for bold experience line ***
    experienceHeaderLine: {
        fontWeight: 'bold',
        fontSize: 10.5,
    },
    itemTitle: { fontWeight: 'bold', fontSize: 10.5 }, // For Projects/Education
    itemDate: { fontSize: 10 },
    itemSubheader: { fontStyle: 'italic', color: '#444', marginVertical: 2, fontSize: 10, marginBottom: 3 },
    
    // *** POINT 6 FIX: Added styles for bullet points ***
    itemList: { marginLeft: 15, marginTop: 2 },
    bulletPoint: { flexDirection: 'row', marginBottom: 3 },
    bullet: { width: 10, fontSize: 10 },
    bulletText: { flex: 1, fontSize: 10, lineHeight: 1.3 },

    summaryText: { lineHeight: 1.4, fontSize: 10, marginBottom: 5 }, // Removed justify
    
    // *** POINT 4 FIX: Added styles for skills section ***
    skillsSection: { marginTop: 4 },
    skillItem: {
        flexDirection: 'row',
        marginBottom: 2
    },
    skillCategory: { fontWeight: 'bold', fontSize: 10 },
    skillText: { fontSize: 10 },
});


// --- COMPONENT FOR TEMPLATE 2: Professional (Targeted Modifications) ---
const ProfessionalTemplate = ({ resumeData }) => {
    const { personalDetails = {}, sections = [], summary = '', experience = [], projects = [], education = [], skills = [] } = resumeData;
    
    // *** POINT 6 FIX: Modified renderBulletPoints to always expect an array ***
    const renderBulletPoints = (points) => {
        const pointArray = Array.isArray(points) ? points : (points ? [points] : []);
        // Filter out empty strings
        const validPoints = pointArray.filter(p => p && p.trim());
        return validPoints.map((point, j) => (
            <View key={j} style={professionalStyles.bulletPoint}>
                <Text style={professionalStyles.bullet}>•</Text>
                <Text style={professionalStyles.bulletText}>{point}</Text>
            </View>
        ));
    };

    // Helper to format URLs for Links
    const formatUrl = (url) => {
        if (!url) return '';
        if (url.startsWith('http://') || url.startsWith('https://')) {
            return url;
        }
        return `https://${url.replace(/^https?:\/\//,'')}`;
    };

    // *** POINT 2 FIX: Helper to join contact info with separators ***
    const joinContactInfo = (items) => {
        const validItems = items.filter(Boolean); // Remove null/undefined/empty strings
        return validItems.map((item, index) => (
            <React.Fragment key={index}>
                {item}
                {index < validItems.length - 1 && <Text style={professionalStyles.separator}> | </Text>}
            </React.Fragment>
        ));
    };


    return (
        <Document>
            <Page size="A4" style={professionalStyles.page}>
                {/* *** POINT 1, 2, 5 FIX: Replaced header with PDF-style centered layout *** */}
                <View style={professionalStyles.header}>
                    <Text style={professionalStyles.name}>{personalDetails.name || ''}</Text>
                    {/* *** ADDED THE LINE YOU REQUESTED *** */}
                    <View style={professionalStyles.headerLine} /> 
                    <View style={professionalStyles.contactInfo}>
                        {joinContactInfo([
                            personalDetails.phone ? <Text style={professionalStyles.contactText}>{personalDetails.phone}</Text> : null,
                            personalDetails.email ? <Text style={professionalStyles.contactText}>{personalDetails.email}</Text> : null,
                            personalDetails.linkedin ? (
                                <Link style={professionalStyles.contactLink} src={formatUrl(personalDetails.linkedin)}>
                                    {personalDetails.linkedin.replace(/^https?:\/\//,'')}
                                </Link>
                            ) : null,
                            personalDetails.github ? (
                                <Link style={professionalStyles.contactLink} src={formatUrl(personalDetails.github)}>
                                    {personalDetails.github.replace(/^https?:\/\//,'')}
                                </Link>
                            ) : null
                        ])}
                    </View>
                </View>
                
                {/* Original section mapping logic */}
                {sections.map((section, i) => {
                    const key = section.key;
                    const title = section.title;

                    if (key === 'personalDetails') return null;

                    if (key === 'summary' && summary) return (<View key={i} style={professionalStyles.section} wrap={false}><Text style={professionalStyles.sectionTitle}>{title}</Text><Text style={professionalStyles.summaryText}>{summary}</Text></View>);
                    
                    if (key === 'experience' && experience) return (
                        <View key={i} style={professionalStyles.section} wrap={false}>
                            <Text style={professionalStyles.sectionTitle}>{title}</Text>
                            {experience.map((exp, j) => (
                                <View key={j} style={professionalStyles.item}>
                                    <View style={professionalStyles.itemHeader}>
                                        {/* *** POINT 3 FIX: Combined company, location, title *** */}
                                        <Text style={professionalStyles.experienceHeaderLine}>
                                            {exp.company || ''}{exp.location ? `, ${exp.location}` : ''}: {exp.jobTitle || ''}
                                        </Text>
                                        <Text style={professionalStyles.itemDate}>{exp.duration || ''}</Text>
                                    </View>
                                    {/* *** ADDED LINK *** */}
                                    {exp.link && <Link style={professionalStyles.link} src={formatUrl(exp.link)}>{exp.link}</Link>}
                                    {/* *** POINT 6 FIX: Render description array as bullets *** */}
                                    <View style={professionalStyles.itemList}>
                                         {renderBulletPoints(exp.description)}
                                     </View>
                                </View>
                            ))}
                        </View>
                    );
                    
                    if (key === 'projects' && projects) return (
                        <View key={i} style={professionalStyles.section} wrap={false}>
                            <Text style={professionalStyles.sectionTitle}>{title}</Text>
                            {projects.map((proj, j) => (
                                <View key={j} style={professionalStyles.item}>
                                    <View style={professionalStyles.itemHeader}>
                                        <Text style={professionalStyles.itemTitle}>{proj.projectTitle || ''}</Text>
                                    </View>
                                    {/* *** ADDED LINK *** */}
                                    {proj.link && <Link style={professionalStyles.link} src={formatUrl(proj.link)}>{proj.link}</Link>}
                                    {/* <Text style={professionalStyles.itemSubheader}>{proj.description || ''}</Text> */}
                                    <View style={professionalStyles.itemList}>
                                        {renderBulletPoints(proj.bulletPoints)}
                                    </View>
                                </View>
                            ))}
                        </View>
                    );
                    
                    if (key === 'education' && education) return (
                        <View key={i} style={professionalStyles.section} wrap={false}>
                            <Text style={professionalStyles.sectionTitle}>{title}</Text>
                            {education.map((edu, j) => (
                                <View key={j} style={professionalStyles.item}>
                                    <View style={professionalStyles.itemHeader}>
                                        <Text style={professionalStyles.itemTitle}>{edu.universityName || ''}</Text>
                                        <Text style={professionalStyles.itemDate}>{edu.duration || ''}</Text>
                                    </View>
                                    <Text style={professionalStyles.itemSubheader}>{edu.degree || ''}</Text>
                                    {edu.gpa && <Text style={professionalStyles.itemSubheader}>GPA: {edu.gpa}</Text>}
                                    {/* *** ADDED LINK *** */}
                                    {edu.link && <Link style={professionalStyles.link} src={formatUrl(edu.link)}>{edu.link}</Link>}
                                </View>
                            ))}
                        </View>
                    );
                    
                    // *** POINT 4 FIX: Render skills as a list ***
                    if (key === 'skills' && skills && skills.length > 0) return (
                        <View key={i} style={professionalStyles.section} wrap={false}>
                            <Text style={professionalStyles.sectionTitle}>{section.title}</Text>
                            <View style={professionalStyles.skillsSection}>
                                {skills.map((skillLine, j) => {
                                    if (!skillLine) return null;
                                    const parts = skillLine.split(':');
                                    if (parts.length > 1) {
                                        const category = parts[0].trim();
                                        const skillsText = parts.slice(1).join(':').trim();
                                        return (
                                            <View key={j} style={professionalStyles.skillItem}>
                                                <Text style={professionalStyles.skillCategory}>{category}: </Text>
                                                <Text style={professionalStyles.skillText}>{skillsText}</Text>
                                            </View>
                                        );
                                    } else {
                                        return (
                                            <View key={j} style={professionalStyles.skillItem}>
                                                <Text style={professionalStyles.skillText}>{skillLine.trim()}</Text>
                                            </View>
                                        );
                                    }
                                })}
                            </View>
                        </View>
                    );

                    if (section.isCustom) return (<View key={i} style={professionalStyles.section}><Text style={professionalStyles.sectionTitle}>{section.title}</Text>{section.type === 'list-with-bullets' ? ((resumeData[section.key] || []).map((item, j) => (<View key={j} style={professionalStyles.item}><View style={professionalStyles.itemHeader}><Text>{item.title || ''}</Text></View><Text style={professionalStyles.itemSubheader}>{item.subtitle || ''}</Text>
                        {/* *** ADDED LINK *** */}
                        {item.link && <Link style={professionalStyles.link} src={formatUrl(item.link)}>{item.link}</Link>}
                        {renderBulletPoints(item.bulletPoints)}</View>))) : section.type === 'single-input-and-description' ? ((resumeData[section.key] || []).map((item, j) => (<View key={j} style={professionalStyles.item}><View style={professionalStyles.itemHeader}><Text>{item.title || ''}</Text></View>
                        {/* *** ADDED LINK *** */}
                        {item.link && <Link style={professionalStyles.link} src={formatUrl(item.link)}>{item.link}</Link>}
                        <Text style={professionalStyles.summaryText}>{item.description || ''}</Text></View>))) : (<Text style={professionalStyles.summaryText}>{resumeData[section.key] || ''}</Text>)}</View>);
                    return null;
                })}
            </Page>
        </Document>
    );
};

// --- Main Document Router --- (No Changes)
const PdfDocument = ({ resumeData, templateName = 'Professional' }) => {
    if (templateName.toLowerCase() === 'academic') {
        return <AcademicTemplate resumeData={resumeData} />;
    }
    return <ProfessionalTemplate resumeData={resumeData} />;
};

// --- Generate PDF Function ---
const generatePdf = async (resumeData, templateName) => {
    try {
        // *** POINT 6 FIX: Ensure description/bulletPoints fields are arrays before rendering ***
        const processedData = JSON.parse(JSON.stringify(resumeData)); // Deep clone

        if (processedData.experience) {
            processedData.experience = processedData.experience.map(exp => ({
                ...exp,
                description: (Array.isArray(exp.description)
                    ? exp.description
                    : (typeof exp.description === 'string' && exp.description.trim() ? [exp.description] : [])
                )
            }));
        }
         if (processedData.projects) {
            processedData.projects = processedData.projects.map(proj => ({
                ...proj,
                bulletPoints: (Array.isArray(proj.bulletPoints)
                    ? proj.bulletPoints
                    : (typeof proj.bulletPoints === 'string' && proj.bulletPoints.trim() ? [proj.bulletPoints] : [])
                )
            }));
        }
        if (processedData.skills && !Array.isArray(processedData.skills)) {
             processedData.skills = typeof processedData.skills === 'string' ? [processedData.skills] : [''];
        } else if (!processedData.skills) {
            processedData.skills = [''];
        }
         if (processedData.sections) {
            processedData.sections.forEach(section => {
                if (section.isCustom && section.type === 'list-with-bullets' && processedData[section.key] && Array.isArray(processedData[section.key])) {
                    processedData[section.key] = processedData[section.key].map(item => ({
                        ...item,
                        bulletPoints: (Array.isArray(item.bulletPoints)
                            ? item.bulletPoints
                            : (typeof item.bulletPoints === 'string' && item.bulletPoints.trim() ? [item.bulletPoints] : [])
                        )
                    }));
                }
            });
        }
        // --- End Fix ---
        
        const stream = await renderToStream(<PdfDocument resumeData={processedData} templateName={templateName} />);
        return stream;
    } catch (error) {
        console.error("React-PDF Generation Error:", error);
        throw new Error('Could not generate PDF.');
    }
};

module.exports = { generatePdf };