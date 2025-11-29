import { Ionicons } from '@expo/vector-icons';
import { useHeaderHeight } from '@react-navigation/elements';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useContext, useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { AuthService } from '../../api/services/AuthServices';
import { AuthContext } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { SettingsStackParamList } from '../../navigation/types';

// Utility function to decode JWT
const decodeJWT = (token: string) => {
    try {
        const payload = token.split('.')[1];
        const decoded = JSON.parse(atob(payload));
        return decoded;
    } catch (error) {
        return null;
    }
};

type ChangePasswordScreenNavigationProp =
    NativeStackNavigationProp<SettingsStackParamList, 'ChangePassword'>;

export default function ChangePasswordScreen() {
    const navigation = useNavigation<ChangePasswordScreenNavigationProp>();
    const headerHeight = useHeaderHeight();
    const { colors } = useTheme();
    const { user } = useContext(AuthContext);

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChangePassword = async () => {
        if (!currentPassword.trim() || !newPassword.trim() || !confirmPassword.trim()) {
            Alert.alert('Error', 'Por favor complete todos los campos');
            return;
        }

        if (newPassword !== confirmPassword) {
            Alert.alert('Error', 'Las contraseñas nuevas no coinciden');
            return;
        }

        if (newPassword.length < 6) {
            Alert.alert('Error', 'La nueva contraseña debe tener al menos 6 caracteres');
            return;
        }

        if (newPassword === currentPassword) {
            Alert.alert('Error', 'La nueva contraseña no puede ser igual a la actual');
            return;
        }

        setLoading(true);
        try {
            // Get userId from JWT token
            const token = user?.data?.accessToken;
            if (!token) {
                Alert.alert('Error', 'No se pudo obtener la información del usuario');
                return;
            }

            const decoded = decodeJWT(token);
            if (!decoded?.person_id) {
                Alert.alert('Error', 'No se pudo obtener el ID del usuario');
                return;
            }

            const userId = parseInt(decoded.person_id);

            const payload = {
                userId,
                currentPassword,
                newPassword,
            };

            const response = await AuthService.changeCurrentPassword(payload);
            if (response.success) {
                Alert.alert('Éxito', 'Contraseña cambiada correctamente');
                navigation.goBack();
            } else {
                // Handle API validation errors
                let errorMessage = 'Error al cambiar la contraseña';

                if (response.data?.errors) {
                    // Parse validation errors from API
                    const errors = response.data.errors;
                    const errorMessages = [];

                    if (errors.CurrentPassword && errors.CurrentPassword.length > 0) {
                        errorMessages.push(...errors.CurrentPassword);
                    }
                    if (errors.NewPassword && errors.NewPassword.length > 0) {
                        errorMessages.push(...errors.NewPassword);
                    }
                    if (errors.UserId && errors.UserId.length > 0) {
                        errorMessages.push(...errors.UserId);
                    }

                    if (errorMessages.length > 0) {
                        errorMessage = errorMessages.join('\n');
                    }
                } else if (response.data?.detail) {
                    // Use detail message if available
                    errorMessage = response.data.detail;
                } else if (response.message) {
                    // Fallback to response message
                    errorMessage = response.message;
                }

                Alert.alert('Error', errorMessage);
            }
        } catch (error) {
            Alert.alert('Error', 'Error de conexión. Verifica tu conexión a internet e intenta nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={[styles.container, { paddingTop: headerHeight, backgroundColor: colors.surfaceSecondary }]}>
            {/* Header Decorator */}
            <View style={[styles.headerDecorator, { backgroundColor: colors.primary }]} />

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Profile Header Section */}
                <View style={[styles.profileSection, { backgroundColor: colors.background }]}>
                    <View style={styles.avatar}>
                        <Ionicons name="lock-closed" size={50} color={colors.primary} />
                    </View>
                    <Text style={[styles.userName, { color: colors.text }]}>Cambiar Contraseña</Text>
                    <Text style={[styles.userRole, { color: colors.textSecondary }]}>
                        Actualiza tu contraseña de forma segura
                    </Text>
                </View>

                {/* Seguridad Section */}
                <View style={[styles.section, { backgroundColor: colors.background }]}>
                    <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Información de Seguridad</Text>

                    {/* Contraseña Actual */}
                    <View style={styles.inputWrapper}>
                        <View style={styles.inputLeft}>
                            <View style={[styles.iconContainer, { backgroundColor: `${colors.primary}15` }]}>
                                <Ionicons name="key-outline" size={20} color={colors.primary} />
                            </View>
                            <View style={styles.inputContent}>
                                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Contraseña Actual</Text>
                                <View style={styles.passwordInputContainer}>
                                    <TextInput
                                        style={[styles.input, { color: colors.text }]}
                                        value={currentPassword}
                                        onChangeText={setCurrentPassword}
                                        placeholder="Ingrese su contraseña actual"
                                        placeholderTextColor={colors.textSecondary}
                                        secureTextEntry={!showCurrentPassword}
                                    />
                                    <TouchableOpacity
                                        onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                                        style={styles.eyeIcon}
                                    >
                                        <Ionicons
                                            name={showCurrentPassword ? "eye-off-outline" : "eye-outline"}
                                            size={20}
                                            color={colors.textSecondary}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Nueva Contraseña */}
                    <View style={styles.inputWrapper}>
                        <View style={styles.inputLeft}>
                            <View style={[styles.iconContainer, { backgroundColor: `${colors.primary}15` }]}>
                                <Ionicons name="lock-closed-outline" size={20} color={colors.primary} />
                            </View>
                            <View style={styles.inputContent}>
                                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Nueva Contraseña</Text>
                                <View style={styles.passwordInputContainer}>
                                    <TextInput
                                        style={[styles.input, { color: colors.text }]}
                                        value={newPassword}
                                        onChangeText={setNewPassword}
                                        placeholder="Ingrese su nueva contraseña"
                                        placeholderTextColor={colors.textSecondary}
                                        secureTextEntry={!showNewPassword}
                                    />
                                    <TouchableOpacity
                                        onPress={() => setShowNewPassword(!showNewPassword)}
                                        style={styles.eyeIcon}
                                    >
                                        <Ionicons
                                            name={showNewPassword ? "eye-off-outline" : "eye-outline"}
                                            size={20}
                                            color={colors.textSecondary}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Confirmar Contraseña */}
                    <View style={[styles.inputWrapper, styles.lastInput]}>
                        <View style={styles.inputLeft}>
                            <View style={[styles.iconContainer, { backgroundColor: `${colors.primary}15` }]}>
                                <Ionicons name="checkmark-circle-outline" size={20} color={colors.primary} />
                            </View>
                            <View style={styles.inputContent}>
                                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Confirmar Nueva Contraseña</Text>
                                <View style={styles.passwordInputContainer}>
                                    <TextInput
                                        style={[styles.input, { color: colors.text }]}
                                        value={confirmPassword}
                                        onChangeText={setConfirmPassword}
                                        placeholder="Confirme su nueva contraseña"
                                        placeholderTextColor={colors.textSecondary}
                                        secureTextEntry={!showConfirmPassword}
                                    />
                                    <TouchableOpacity
                                        onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                        style={styles.eyeIcon}
                                    >
                                        <Ionicons
                                            name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                                            size={20}
                                            color={colors.textSecondary}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Info Box */}
                <View style={[styles.infoBox, { backgroundColor: `${colors.primary}10` }]}>
                    <Ionicons name="information-circle" size={24} color={colors.primary} />
                    <View style={styles.infoContent}>
                        <Text style={[styles.infoTitle, { color: colors.text }]}>Requisitos de seguridad</Text>
                        <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                            • Mínimo 6 caracteres{'\n'}
                            • Usa una combinación de letras y números{'\n'}
                            • No compartas tu contraseña
                        </Text>
                    </View>
                </View>

                {/* Botón Guardar */}
                <TouchableOpacity
                    style={[
                        styles.saveButton,
                        { backgroundColor: colors.primary },
                        loading && styles.saveButtonDisabled
                    ]}
                    onPress={handleChangePassword}
                    disabled={loading}
                >
                    <Ionicons name="shield-checkmark" size={24} color="white" />
                    <Text style={styles.saveButtonText}>
                        {loading ? 'Cambiando...' : 'Cambiar Contraseña'}
                    </Text>
                </TouchableOpacity>

                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
    },
    headerDecorator: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 200,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        zIndex: 0,
    },
    scrollView: {
        flex: 1,
        zIndex: 1,
    },
    scrollContent: {
        paddingTop: 80,
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    profileSection: {
        borderRadius: 20,
        paddingTop: 60,
        paddingBottom: 24,
        paddingHorizontal: 24,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
        position: 'relative',
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 12,
        borderWidth: 4,
        borderColor: 'white',
        position: 'absolute',
        top: -50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
    },
    userName: {
        fontSize: 22,
        fontWeight: '700',
        marginBottom: 4,
    },
    userRole: {
        fontSize: 14,
        textAlign: 'center',
    },
    section: {
        marginTop: 20,
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 16,
        paddingHorizontal: 4,
    },
    inputWrapper: {
        paddingVertical: 12,
        paddingHorizontal: 4,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    lastInput: {
        borderBottomWidth: 0,
    },
    inputLeft: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        flex: 1,
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
        marginTop: 20,
    },
    inputContent: {
        flex: 1,
    },
    inputLabel: {
        fontSize: 12,
        fontWeight: '500',
        marginBottom: 4,
    },
    passwordInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        fontSize: 16,
        fontWeight: '500',
        paddingVertical: 8,
        flex: 1,
    },
    eyeIcon: {
        padding: 8,
        marginLeft: 8,
    },
    infoBox: {
        marginTop: 20,
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
    },
    infoContent: {
        flex: 1,
    },
    infoTitle: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 4,
    },
    infoText: {
        fontSize: 13,
        lineHeight: 20,
    },
    saveButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 24,
        padding: 16,
        borderRadius: 16,
        gap: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    saveButtonDisabled: {
        opacity: 0.6,
    },
    saveButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: 'white',
    },
});